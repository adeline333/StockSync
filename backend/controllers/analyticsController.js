const db = require('../db');

// GET /api/analytics/forecast — sales trend + simple forecast
exports.getForecast = async (req, res) => {
  const { branch_id, months = 6 } = req.query;
  const branchFilter = branch_id ? `AND o.branch_id = ${parseInt(branch_id)}` : '';

  try {
    // Monthly sales for past N months
    const salesTrend = await db.query(
      `SELECT 
        TO_CHAR(DATE_TRUNC('month', o.created_at), 'Mon YYYY') as month,
        DATE_TRUNC('month', o.created_at) as month_date,
        COUNT(*) as transaction_count,
        COALESCE(SUM(o.total_amount), 0) as revenue,
        COALESCE(SUM(oi.quantity), 0) as units_sold
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.status = 'completed'
         AND o.created_at >= NOW() - INTERVAL '${parseInt(months)} months'
         ${branchFilter}
       GROUP BY DATE_TRUNC('month', o.created_at)
       ORDER BY month_date ASC`
    );

    // Top selling products (for velocity calculation)
    const topProducts = await db.query(
      `SELECT oi.product_id, p.name, p.sku,
        SUM(oi.quantity) as total_sold,
        COUNT(DISTINCT o.id) as order_count,
        ROUND(SUM(oi.quantity)::numeric / GREATEST(${parseInt(months)} * 30, 1), 2) as daily_velocity
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       JOIN products p ON oi.product_id = p.id
       WHERE o.status = 'completed'
         AND o.created_at >= NOW() - INTERVAL '${parseInt(months)} months'
         ${branchFilter}
       GROUP BY oi.product_id, p.name, p.sku
       ORDER BY total_sold DESC
       LIMIT 10`
    );

    // Simple linear forecast for next 2 months
    const trend = salesTrend.rows;
    let projectedGrowth = 0;
    if (trend.length >= 2) {
      const last = parseFloat(trend[trend.length - 1]?.revenue || 0);
      const prev = parseFloat(trend[trend.length - 2]?.revenue || 0);
      projectedGrowth = prev > 0 ? ((last - prev) / prev * 100).toFixed(1) : 0;
    }

    // Model confidence based on data points available
    const confidence = Math.min(95, 60 + trend.length * 5);

    res.json({
      trend: salesTrend.rows,
      topProducts: topProducts.rows,
      projectedGrowth: parseFloat(projectedGrowth),
      confidence,
      months: parseInt(months)
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/analytics/stockout-risk — products at risk of running out
exports.getStockOutRisk = async (req, res) => {
  const { branch_id } = req.query;
  const branchFilter = branch_id ? `AND i.branch_id = ${parseInt(branch_id)}` : '';
  const txBranchFilter = branch_id ? `AND t.source_branch_id = ${parseInt(branch_id)}` : '';

  try {
    // Get all products with current stock
    const products = await db.query(
      `SELECT p.id, p.name, p.sku, p.supplier_lead_days, p.price,
        COALESCE(SUM(i.quantity), 0) as current_stock,
        COALESCE(MIN(i.min_stock_level), 10) as min_stock_level
       FROM products p
       LEFT JOIN inventory i ON p.id = i.product_id
       WHERE 1=1 ${branchFilter}
       GROUP BY p.id
       HAVING COALESCE(SUM(i.quantity), 0) > 0
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
      const daysRemaining = dailyVelocity > 0 ? Math.floor(currentStock / dailyVelocity) : 999;
      const leadDays = parseInt(product.supplier_lead_days) || 3;

      let riskLevel = 'safe';
      if (daysRemaining <= leadDays) riskLevel = 'critical';
      else if (daysRemaining <= 7) riskLevel = 'high';
      else if (daysRemaining <= 14) riskLevel = 'moderate';
      else if (daysRemaining <= 30) riskLevel = 'low';

      if (riskLevel !== 'safe' || daysRemaining <= 30) {
        riskItems.push({
          ...product,
          daily_velocity: dailyVelocity,
          days_remaining: daysRemaining,
          risk_level: riskLevel,
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
      potential_loss: totalPotentialLoss.toFixed(0)
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/analytics/reorder — reorder recommendations
exports.getReorderRecommendations = async (req, res) => {
  const { branch_id } = req.query;
  const branchFilter = branch_id ? `AND i.branch_id = ${parseInt(branch_id)}` : '';
  const txBranchFilter = branch_id ? `AND t.source_branch_id = ${parseInt(branch_id)}` : '';

  try {
    const products = await db.query(
      `SELECT p.id, p.name, p.sku, p.supplier_name, p.supplier_lead_days, p.cost_price, p.price,
        COALESCE(SUM(i.quantity), 0) as current_stock,
        COALESCE(MIN(i.min_stock_level), 10) as min_stock_level
       FROM products p
       LEFT JOIN inventory i ON p.id = i.product_id
       WHERE 1=1 ${branchFilter}
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
