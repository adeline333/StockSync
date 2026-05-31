const db = require('./db');
const ForecastingEngine = require('./utils/ForecastingEngine');

async function checkRiskReal() {
  try {
    console.log('--- LIVE BRANCH-BY-BRANCH STOCK RISK ANALYSIS ---');

    const branches = await db.query('SELECT * FROM branches ORDER BY id');

    for (const branch of branches.rows) {
      console.log(`\n======================================================`);
      console.log(`🏢 BRANCH: ${branch.name} (ID: ${branch.id})`);
      console.log(`======================================================`);

      const inventory = await db.query(
        `SELECT p.id, p.name, p.sku, p.supplier_lead_days, p.price, p.cost_price,
          COALESCE(i.quantity, 0) as current_stock
         FROM products p
         LEFT JOIN inventory i ON p.id = i.product_id AND i.branch_id = $1
         ORDER BY current_stock ASC`,
        [branch.id]
      );

      for (const product of inventory.rows) {
        // Calculate daily velocity from last 30 days of sales in this branch
        const velocityResult = await db.query(
          `SELECT COALESCE(SUM(t.quantity), 0) as sold_30d
           FROM transactions t
           WHERE t.product_id = $1
             AND t.type = 'sale'
             AND t.source_branch_id = $2
             AND t.created_at >= NOW() - INTERVAL '30 days'`,
          [product.id, branch.id]
        );

        const sold30d = parseInt(velocityResult.rows[0].sold_30d);
        const dailyVelocity = parseFloat((sold30d / 30).toFixed(2));
        const currentStock = parseInt(product.current_stock);
        const leadDays = parseInt(product.supplier_lead_days) || 3;
        
        const optimalSafetyStock = ForecastingEngine.calculateSafetyStock(dailyVelocity, leadDays);
        const reorderPoint = (dailyVelocity * leadDays) + optimalSafetyStock;
        const daysRemaining = dailyVelocity > 0 ? Math.floor(currentStock / dailyVelocity) : 999;

        let riskLevel = 'safe';
        if (currentStock <= dailyVelocity * leadDays) {
          riskLevel = 'critical';
        } else if (currentStock <= reorderPoint) {
          riskLevel = 'high';
        } else if (daysRemaining <= 14) {
          riskLevel = 'moderate';
        } else if (daysRemaining <= 30) {
          riskLevel = 'low';
        }

        // If the product is not stocked in this branch at all, mark it appropriately
        console.log(`📦 Product: ${product.name}`);
        console.log(`   Current Stock: ${currentStock} units`);
        console.log(`   30-Day Sales at this branch: ${sold30d} units (Daily Velocity: ${dailyVelocity}/day)`);
        console.log(`   Reorder Point (Threshold): ${Math.ceil(reorderPoint)} units`);
        console.log(`   Days Remaining: ${daysRemaining === 999 ? '∞ (No Sales)' : daysRemaining + ' days'}`);
        console.log(`   Risk Status: ${riskLevel.toUpperCase()}`);
        console.log(`   --------------------------------------`);
      }
    }

    process.exit(0);
  } catch (e) {
    console.error('Error running checkRiskReal:', e);
    process.exit(1);
  }
}

checkRiskReal();
