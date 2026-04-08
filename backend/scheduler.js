const cron = require('node-cron');
const db = require('./db');

const logActivity = async (action, details) => {
  try {
    await db.query(
      'INSERT INTO activity_logs (user_id, action, details, ip_address) VALUES ($1,$2,$3,$4)',
      [null, action, details, 'SCHEDULER']
    );
  } catch (e) { console.error('Scheduler log error:', e.message); }
};

const runDailyReconciliation = async () => {
  console.log('[Scheduler] Running daily reconciliation...');
  try {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Get all branches
    const branches = await db.query('SELECT id, name FROM branches');

    for (const branch of branches.rows) {
      // Sales for yesterday per product
      const salesResult = await db.query(
        `SELECT oi.product_id, p.name as product_name, p.sku,
           SUM(oi.quantity) as sales_qty
         FROM order_items oi
         JOIN orders o ON oi.order_id = o.id
         JOIN products p ON oi.product_id = p.id
         WHERE o.status = 'completed'
           AND DATE(o.created_at) = $1
           AND o.branch_id = $2
         GROUP BY oi.product_id, p.name, p.sku`,
        [yesterday, branch.id]
      );

      if (salesResult.rows.length === 0) continue;

      // Stock deductions for yesterday
      const deductionsResult = await db.query(
        `SELECT t.product_id, SUM(t.quantity) as deducted_qty
         FROM transactions t
         WHERE t.type = 'sale'
           AND DATE(t.created_at) = $1
           AND t.source_branch_id = $2
         GROUP BY t.product_id`,
        [yesterday, branch.id]
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

      const totalItems = items.length;
      const matchedItems = items.filter(i => i.status === 'matched').length;
      const mismatchedItems = items.filter(i => i.status !== 'matched').length;
      const score = totalItems > 0 ? parseFloat(((matchedItems / totalItems) * 100).toFixed(2)) : 100;

      let varianceValue = 0;
      for (const item of items.filter(i => i.variance !== 0)) {
        const priceResult = await db.query('SELECT price FROM products WHERE id = $1', [item.product_id]);
        if (priceResult.rows.length > 0) {
          varianceValue += Math.abs(item.variance) * parseFloat(priceResult.rows[0].price);
        }
      }

      const reconResult = await db.query(
        `INSERT INTO reconciliations (branch_id, period_start, period_end, total_items, matched_items, mismatched_items, variance_value, score, status, run_by)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'completed',NULL) RETURNING id`,
        [branch.id, yesterday, yesterday, totalItems, matchedItems, mismatchedItems, varianceValue.toFixed(2), score]
      );

      const reconId = reconResult.rows[0].id;
      for (const item of items) {
        await db.query(
          `INSERT INTO reconciliation_items (reconciliation_id, product_id, product_name, product_sku, sales_qty, stock_deducted, variance, status)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [reconId, item.product_id, item.product_name, item.product_sku, item.sales_qty, item.stock_deducted, item.variance, item.status]
        );
      }

      console.log(`[Scheduler] ${branch.name}: score ${score}%, ${mismatchedItems} issues`);

      // Alert if mismatches found
      if (mismatchedItems > 0) {
        await logActivity('SCHEDULED_RECONCILIATION_ALERT',
          `Auto-reconciliation for ${branch.name} on ${yesterday}: ${mismatchedItems} mismatch(es) found. Score: ${score}%`
        );
      }
    }

    await logActivity('SCHEDULED_RECONCILIATION', `Daily auto-reconciliation completed for ${yesterday}`);
    console.log('[Scheduler] Daily reconciliation complete.');
  } catch (e) {
    console.error('[Scheduler] Reconciliation failed:', e.message);
    await logActivity('SCHEDULED_RECONCILIATION_ERROR', `Auto-reconciliation failed: ${e.message}`);
  }
};

// Schedule: runs every day at 2:00 AM
cron.schedule('0 2 * * *', runDailyReconciliation, {
  timezone: 'Africa/Kigali'
});

// Also run a quick stock alert check every hour
cron.schedule('0 * * * *', async () => {
  console.log('[Scheduler] Running hourly low-stock check...');
  try {
    const lowStock = await db.query(
      `SELECT p.name, p.sku, i.quantity, i.min_stock_level, b.name as branch_name
       FROM inventory i
       JOIN products p ON i.product_id = p.id
       JOIN branches b ON i.branch_id = b.id
       WHERE i.quantity <= i.min_stock_level AND i.quantity > 0`
    );

    if (lowStock.rows.length > 0) {
      await logActivity('LOW_STOCK_ALERT',
        `${lowStock.rows.length} item(s) at or below minimum stock level: ${lowStock.rows.map(r => `${r.name} (${r.branch_name}: ${r.quantity})`).join(', ')}`
      );
      // Create in-app notifications for each low stock item
      for (const item of lowStock.rows) {
        await db.query(
          `INSERT INTO notifications (user_id, title, message, category, severity, action_url)
           VALUES (NULL, $1, $2, 'inventory', 'critical', '/analytics/stock-risk')`,
          [
            `Low Stock: ${item.name}`,
            `${item.name} (${item.branch_name}) has only ${item.quantity} units remaining, below minimum of ${item.min_stock_level}.`
          ]
        );
      }
    }
  } catch (e) {
    console.error('[Scheduler] Low-stock check failed:', e.message);
  }
});

console.log('[Scheduler] Jobs registered: daily reconciliation at 02:00 CAT, hourly low-stock check');

module.exports = { runDailyReconciliation };
