const db = require('../db');
const ForecastingEngine = require('../utils/ForecastingEngine');

// GET /api/analytics/forecast — 7-day sales trend
exports.getForecast = async (req, res) => {
  const { branch_id, days = 7 } = req.query;
  const branchFilter = branch_id ? `AND o.branch_id = ${parseInt(branch_id)}` : '';

  try {
    // Daily sales for past N days
    const salesTrend = await db.query(
      `SELECT 
        TO_CHAR(DATE_TRUNC('day', o.created_at), 'Mon DD') as day_label,
        DATE_TRUNC('day', o.created_at) as day_date,
        COUNT(DISTINCT o.id) as transaction_count,
        COALESCE(SUM(o.total_amount), 0) as revenue
       FROM orders o
       WHERE o.status = 'completed'
         AND o.created_at >= NOW() - INTERVAL '${parseInt(days)} days'
         ${branchFilter}
       GROUP BY DATE_TRUNC('day', o.created_at)
       ORDER BY day_date ASC`
    );

    // If there is no data, generate a 7-day array filled with 0s to avoid empty UI
    const trend = [];
    for (let i = parseInt(days) - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).replace(',', '');
      // Match "May 17" format exactly to Postgres "Mon DD"
      const parts = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).split(' ');
      const formattedLabel = `${parts[0]} ${parts[1].padStart(2, '0')}`;
      
      const found = salesTrend.rows.find(r => r.day_label === formattedLabel);
      trend.push({
        day_label: formattedLabel,
        transaction_count: found ? parseInt(found.transaction_count) : 0,
        revenue: found ? parseFloat(found.revenue) : 0
      });
    }

    // Top selling products (for velocity calculation)
    const topProducts = await db.query(
      `SELECT oi.product_id, p.name, p.sku,
        SUM(oi.quantity) as total_sold,
        COUNT(DISTINCT o.id) as order_count,
        ROUND(SUM(oi.quantity)::numeric / GREATEST(${parseInt(days)}, 1), 2) as daily_velocity
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       JOIN products p ON oi.product_id = p.id
       WHERE o.status = 'completed'
         AND o.created_at >= NOW() - INTERVAL '${parseInt(days)} days'
         ${branchFilter}
       GROUP BY oi.product_id, p.name, p.sku
       ORDER BY total_sold DESC
       LIMIT 10`
    );

    // Compute simple totals for KPI cards
    const totalRevenue = trend.reduce((sum, d) => sum + d.revenue, 0);
    const totalOrders = trend.reduce((sum, d) => sum + d.transaction_count, 0);

    // Simple forecast: average of last 7 days applied to tomorrow
    const dailyAvg = totalRevenue / parseInt(days);
    const tomorrowForecast = dailyAvg;
    const projectedGrowth = dailyAvg > 0 ? (((tomorrowForecast - trend[trend.length-1].revenue) / dailyAvg) * 100).toFixed(1) : 0;

    // Compute ABC Analysis using K-Means Clustering
    const allProductsSales = await db.query(
      `SELECT oi.product_id, p.name, p.sku,
        SUM(oi.quantity) as total_sold,
        SUM(oi.quantity * oi.unit_price) as total_revenue
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       JOIN products p ON oi.product_id = p.id
       WHERE o.status = 'completed'
         AND o.created_at >= NOW() - INTERVAL '${parseInt(days)} days'
         ${branchFilter}
       GROUP BY oi.product_id, p.name, p.sku`
    );

    let abcAnalysis = [];
    if (allProductsSales.rows.length > 0) {
      // Find max volume and revenue for normalization
      const maxVolume = Math.max(...allProductsSales.rows.map(r => Number(r.total_sold)), 1);
      const maxRevenue = Math.max(...allProductsSales.rows.map(r => Number(r.total_revenue)), 1);

      // Create points for K-Means
      const points = allProductsSales.rows.map(p => ({
        ...p,
        total_sold: Number(p.total_sold),
        total_revenue: Number(p.total_revenue),
        x: Number(p.total_sold) / maxVolume, // Normalized volume
        y: Number(p.total_revenue) / maxRevenue // Normalized revenue
      }));

      // Run K-Means with K=Math.min(3, points.length)
      const k = Math.min(3, points.length);
      const kMeansResult = ForecastingEngine.kMeans(points, k);
      
      // If ForecastingEngine returns an array directly (due to old bug) or object
      const resultPoints = Array.isArray(kMeansResult) ? kMeansResult : kMeansResult.points;
      const resultCentroids = Array.isArray(kMeansResult) 
        ? [{ x: 1, y: 1 }] // Dummy centroid
        : kMeansResult.centroids;

      // Sort centroids to figure out which cluster is A, B, and C.
      // We score them by x + y (normalized volume + revenue). Higher is better.
      const centroids = resultCentroids.map((c, idx) => ({ ...c, originalIndex: idx }));
      centroids.sort((a, b) => (b.x + b.y) - (a.x + a.y)); // Descending
      
      // Map cluster indices to Tiers
      const tierMap = {};
      if (centroids.length > 0) tierMap[centroids[0].originalIndex] = 'A';
      if (centroids.length > 1) tierMap[centroids[1].originalIndex] = 'B';
      if (centroids.length > 2) tierMap[centroids[2].originalIndex] = 'C';

      abcAnalysis = resultPoints.map(p => ({
        product_id: p.product_id,
        name: p.name,
        sku: p.sku,
        total_sold: p.total_sold,
        total_revenue: p.total_revenue,
        tier: tierMap[p.cluster] || 'A'
      }));

      // Sort abcAnalysis so A is first, then B, then C, and by revenue descending within tiers
      abcAnalysis.sort((a, b) => {
        if (a.tier === b.tier) return b.total_revenue - a.total_revenue;
        return a.tier > b.tier ? 1 : -1;
      });
    }

    res.json({
      trend: trend,
      topProducts: topProducts.rows,
      abcAnalysis: abcAnalysis,
      forecast: [tomorrowForecast],
      projectedGrowth: parseFloat(projectedGrowth),
      totalRevenue,
      totalOrders,
      days: parseInt(days)
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/analytics/stockout-risk — products at risk of running out
exports.getStockOutRisk = async (req, res) => {
  const { branch_id } = req.query;
  const joinBranchFilter = branch_id ? `AND i.branch_id = ${parseInt(branch_id)}` : '';
  const txBranchFilter = branch_id ? `AND t.source_branch_id = ${parseInt(branch_id)}` : '';

  try {
    // Get all products with current stock (even if 0 or unstocked in this branch)
    const products = await db.query(
      `SELECT p.id, p.name, p.sku, p.supplier_lead_days, p.price,
        COALESCE(SUM(i.quantity), 0) as current_stock,
        COALESCE(MIN(i.min_stock_level), 10) as min_stock_level
       FROM products p
       LEFT JOIN inventory i ON p.id = i.product_id ${joinBranchFilter}
       GROUP BY p.id
       ORDER BY COALESCE(SUM(i.quantity), 0) ASC`
    );

    const riskItems = [];

    for (const product of products.rows) {
      // Calculate daily velocity from last 30 days of sales
      const velocityResult = await db.query(
        `SELECT COALESCE(SUM(t.quantity), 0) as sold_30d
         FROM transactions t
         WHERE t.product_id = $1
           AND t.type = 'sale'
           AND t.created_at >= NOW() - INTERVAL '30 days'
           ${txBranchFilter}`,
        [product.id]
      );

      const sold30d = parseInt(velocityResult.rows[0].sold_30d);
      const dailyVelocity = parseFloat((sold30d / 30).toFixed(2));
      const currentStock = parseInt(product.current_stock);
      const leadDays = parseInt(product.supplier_lead_days) || 3;
      
      // Calculate sensible metrics
      const optimalSafetyStock = ForecastingEngine.calculateSafetyStock(dailyVelocity, leadDays);
      const reorderPoint = (dailyVelocity * leadDays) + optimalSafetyStock;
      const daysRemaining = dailyVelocity > 0 ? Math.floor(currentStock / dailyVelocity) : 999;
      const minStock = parseInt(product.min_stock_level) || 10;

      let riskLevel = 'safe';
      if (currentStock === 0) riskLevel = 'critical';
      else if (currentStock <= dailyVelocity * leadDays) riskLevel = 'critical';
      else if (currentStock <= reorderPoint || currentStock <= minStock) riskLevel = 'high';
      else if (daysRemaining <= 14) riskLevel = 'moderate';
      else if (daysRemaining <= 30) riskLevel = 'low';

      if (riskLevel !== 'safe' || daysRemaining <= 30) {
        riskItems.push({
          ...product,
          daily_velocity: dailyVelocity,
          days_remaining: daysRemaining,
          risk_level: riskLevel,
          optimal_safety_stock: optimalSafetyStock,
          reorder_point: Math.ceil(reorderPoint),
          potential_loss: (dailyVelocity * Math.min(daysRemaining, 7) * parseFloat(product.price)).toFixed(0)
        });
      }
    }

    // Sort by risk level
    const riskOrder = { critical: 0, high: 1, moderate: 2, low: 3, safe: 4 };
    riskItems.sort((a, b) => riskOrder[a.risk_level] - riskOrder[b.risk_level]);

    const totalPotentialLoss = riskItems.reduce((s, i) => s + parseFloat(i.potential_loss), 0);

    res.json({
      items: riskItems,
      total_at_risk: riskItems.filter(i => ['critical', 'high'].includes(i.risk_level)).length,
      potential_loss: totalPotentialLoss.toFixed(0),
      model_type: 'Demand-Variance Safety Stock (95% Service Level)'
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/analytics/reorder — reorder recommendations
exports.getReorderRecommendations = async (req, res) => {
  const { branch_id } = req.query;
  const joinBranchFilter = branch_id ? `AND i.branch_id = ${parseInt(branch_id)}` : '';
  const txBranchFilter = branch_id ? `AND t.source_branch_id = ${parseInt(branch_id)}` : '';

  try {
    const products = await db.query(
      `SELECT p.id, p.name, p.sku, p.supplier_name, p.supplier_lead_days, p.cost_price, p.price,
        COALESCE(SUM(i.quantity), 0) as current_stock,
        COALESCE(MIN(i.min_stock_level), 10) as min_stock_level
       FROM products p
       LEFT JOIN inventory i ON p.id = i.product_id ${joinBranchFilter}
       GROUP BY p.id
       ORDER BY COALESCE(SUM(i.quantity), 0) ASC`
    );

    const recommendations = [];

    for (const product of products.rows) {
      const velocityResult = await db.query(
        `SELECT COALESCE(SUM(t.quantity), 0) as sold_30d
         FROM transactions t
         WHERE t.product_id = $1
           AND t.type = 'sale'
           AND t.created_at >= NOW() - INTERVAL '30 days'
           ${txBranchFilter}`,
        [product.id]
      );

      const sold30d = parseInt(velocityResult.rows[0].sold_30d);
      const dailyVelocity = sold30d / 30;
      const currentStock = parseInt(product.current_stock);
      const leadDays = parseInt(product.supplier_lead_days) || 3;
      const safetyStock = Math.ceil(dailyVelocity * leadDays * 1.5);
      const daysRemaining = dailyVelocity > 0 ? Math.floor(currentStock / dailyVelocity) : 999;

      // Only recommend if below safety stock or running low
      if (currentStock <= safetyStock || daysRemaining <= 14) {
        const suggestedQty = Math.max(
          Math.ceil(dailyVelocity * 30), // 30-day supply
          parseInt(product.min_stock_level) * 3
        );
        const estimatedCost = suggestedQty * parseFloat(product.cost_price || product.price * 0.7);

        let stockStatus = 'steady';
        if (currentStock === 0) stockStatus = 'out_of_stock';
        else if (daysRemaining <= leadDays) stockStatus = 'critical';
        else if (daysRemaining <= 7) stockStatus = 'low';

        recommendations.push({
          ...product,
          daily_velocity: dailyVelocity.toFixed(2),
          days_remaining: daysRemaining,
          suggested_qty: suggestedQty,
          estimated_cost: estimatedCost.toFixed(0),
          stock_status: stockStatus
        });
      }
    }

    const totalCost = recommendations.reduce((s, r) => s + parseFloat(r.estimated_cost), 0);

    res.json({
      recommendations,
      total_cost: totalCost.toFixed(0),
      total_skus: recommendations.length
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};
