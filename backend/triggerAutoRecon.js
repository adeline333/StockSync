const db = require('./db');

(async () => {
  try {
    console.log('🚀 Manually triggering Automated Reconciliation Engine (Sales vs Deductions)...');
    
    // Period is today
    const todayStr = new Date().toISOString().split('T')[0];
    const period_start = todayStr;
    const period_end = todayStr;
    
    // We will run this for active branches
    const branchesRes = await db.query('SELECT id, name FROM branches WHERE is_active = TRUE');
    
    // Get a user ID to attribute the run to (e.g. the first admin)
    const userRes = await db.query("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
    if (userRes.rows.length === 0) {
      console.log('❌ No admin user found to attribute the run to.');
      process.exit(1);
    }
    const adminId = userRes.rows[0].id;

    for (const branch of branchesRes.rows) {
      console.log(`\n📊 Running auto-reconciliation for ${branch.name} (ID: ${branch.id})...`);
      
      // 1. Get all completed sales (order_items)
      const salesResult = await db.query(
        `SELECT oi.product_id, p.name as product_name, p.sku, SUM(oi.quantity) as sales_qty
         FROM order_items oi
         JOIN orders o ON oi.order_id = o.id
         JOIN products p ON oi.product_id = p.id
         WHERE o.status = 'completed'
           AND DATE(o.created_at) BETWEEN $1 AND $2
           AND o.branch_id = $3
         GROUP BY oi.product_id, p.name, p.sku`,
        [period_start, period_end, branch.id]
      );
      
      // 2. Get all stock deductions (transactions of type sale)
      const deductionsResult = await db.query(
        `SELECT t.product_id, SUM(t.quantity) as deducted_qty
         FROM transactions t
         WHERE t.type = 'sale'
           AND DATE(t.created_at) BETWEEN $1 AND $2
           AND t.source_branch_id = $3
         GROUP BY t.product_id`,
        [period_start, period_end, branch.id]
      );
      
      const deductionMap = {};
      deductionsResult.rows.forEach(d => { deductionMap[d.product_id] = parseInt(d.deducted_qty); });
      
      const items = salesResult.rows.map(s => {
        const salesQty = parseInt(s.sales_qty);
        const stockDeducted = deductionMap[s.product_id] || 0;
        const variance = salesQty - stockDeducted;
        const status = variance === 0 ? 'matched' : Math.abs(variance) <= 2 ? 'flagged' : 'mismatched';
        return { product_id: s.product_id, product_name: s.product_name, product_sku: s.sku, sales_qty: salesQty, stock_deducted: stockDeducted, variance, status };
      });
      
      if (items.length === 0) {
        console.log(`  ℹ️ No sales transactions found for ${branch.name} today. Creating empty matched record.`);
      }
      
      const totalItems = items.length;
      const matchedItems = items.filter(i => i.status === 'matched').length;
      const score = totalItems > 0 ? parseFloat(((matchedItems / totalItems) * 100).toFixed(2)) : 100;
      
      let varianceValue = 0;
      for (const item of items.filter(i => i.variance !== 0)) {
        const priceResult = await db.query('SELECT price FROM products WHERE id = $1', [item.product_id]);
        if (priceResult.rows.length > 0) {
          varianceValue += Math.abs(item.variance) * parseFloat(priceResult.rows[0].price);
        }
      }
      
      // Save reconciliation record
      const reconResult = await db.query(
        `INSERT INTO reconciliations (branch_id, period_start, period_end, total_items, matched_items, mismatched_items, variance_value, score, status, run_by, notes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'completed',$9,$10) RETURNING *`,
        [branch.id, period_start, period_end, totalItems, matchedItems, totalItems - matchedItems, varianceValue.toFixed(2), score, adminId, '[Auto System] Automated Daily Reconciliation Run']
      );
      const recon = reconResult.rows[0];
      
      // Save items
      for (const item of items) {
        await db.query(
          `INSERT INTO reconciliation_items (reconciliation_id, product_id, product_name, product_sku, sales_qty, stock_deducted, variance, status)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [recon.id, item.product_id, item.product_name, item.product_sku, item.sales_qty, item.stock_deducted, item.variance, item.status]
        );
      }
      console.log(`  ✅ Successfully ran automated reconciliation for ${branch.name}. Accuracy Score: ${score}%`);
    }
    
    console.log('\n🎉 Automated Reconciliation Engine completed! Go check your Stock Reconciliation History in the browser!');
    process.exit(0);
  } catch (e) {
    console.error('❌ Error triggering reconciliation:', e.message);
    process.exit(1);
  }
})();
