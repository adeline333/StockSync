const db = require('../db');

const logActivity = async (user_id, action, details, ip) => {
  try {
    await db.query('INSERT INTO activity_logs (user_id, action, details, ip_address) VALUES ($1,$2,$3,$4)', [user_id, action, details, ip]);
  } catch (e) { console.error('Log error:', e.message); }
};
const getIP = (req) => req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

// POST /api/reconciliation/run — auto-match sales vs inventory deductions
exports.runReconciliation = async (req, res) => {
  const { branch_id, period_start, period_end } = req.body;
  const ip = getIP(req);

  try {
    // Get all sales (order_items) in period
    const salesResult = await db.query(
      `SELECT oi.product_id, p.name as product_name, p.sku,
        SUM(oi.quantity) as sales_qty
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       JOIN products p ON oi.product_id = p.id
       WHERE o.status = 'completed'
         AND DATE(o.created_at) BETWEEN $1 AND $2
         ${branch_id ? 'AND o.branch_id = $3' : ''}
       GROUP BY oi.product_id, p.name, p.sku`,
      branch_id ? [period_start, period_end, branch_id] : [period_start, period_end]
    );

    // Get all stock deductions (transactions of type sale) in period
    const deductionsResult = await db.query(
      `SELECT t.product_id, SUM(t.quantity) as deducted_qty
       FROM transactions t
       WHERE t.type = 'sale'
         AND DATE(t.created_at) BETWEEN $1 AND $2
         ${branch_id ? 'AND t.source_branch_id = $3' : ''}
       GROUP BY t.product_id`,
      branch_id ? [period_start, period_end, branch_id] : [period_start, period_end]
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

    // Calculate variance value
    const varianceValueResult = await db.query(
      `SELECT COALESCE(SUM(ABS($1::int) * p.price), 0) as total FROM products p WHERE p.id = ANY($2)`,
      [0, items.filter(i => i.variance !== 0).map(i => i.product_id)]
    );

    let varianceValue = 0;
    for (const item of items.filter(i => i.variance !== 0)) {
      const priceResult = await db.query('SELECT price FROM products WHERE id = $1', [item.product_id]);
      if (priceResult.rows.length > 0) {
        varianceValue += Math.abs(item.variance) * parseFloat(priceResult.rows[0].price);
      }
    }

    // Save reconciliation record
    const reconResult = await db.query(
      `INSERT INTO reconciliations (branch_id, period_start, period_end, total_items, matched_items, mismatched_items, variance_value, score, status, run_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'completed',$9) RETURNING *`,
      [branch_id || null, period_start, period_end, totalItems, matchedItems, mismatchedItems, varianceValue.toFixed(2), score, req.user.id]
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

    await logActivity(req.user.id, 'RECONCILIATION_RUN', `Reconciliation run: ${period_start} to ${period_end}, score ${score}%`, ip);

    res.json({ reconciliation: recon, items });
  } catch (e) {
    console.error('Reconciliation error:', e);
    res.status(500).json({ message: e.message });
  }
};

// GET /api/reconciliation — list all reconciliation runs
exports.getReconciliations = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT r.*, b.name as branch_name, u.name as run_by_name
       FROM reconciliations r
       LEFT JOIN branches b ON r.branch_id = b.id
       LEFT JOIN users u ON r.run_by = u.id
       ORDER BY r.created_at DESC LIMIT 50`
    );
    res.json({ reconciliations: result.rows });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/reconciliation/latest — get latest run with items
exports.getLatest = async (req, res) => {
  const { branch_id } = req.query;
  try {
    const reconResult = await db.query(
      `SELECT r.*, b.name as branch_name FROM reconciliations r
       LEFT JOIN branches b ON r.branch_id = b.id
       ${branch_id ? 'WHERE r.branch_id = $1' : ''}
       ORDER BY r.created_at DESC LIMIT 1`,
      branch_id ? [branch_id] : []
    );

    if (reconResult.rows.length === 0) return res.json({ reconciliation: null, items: [] });

    const recon = reconResult.rows[0];
    const itemsResult = await db.query(
      'SELECT * FROM reconciliation_items WHERE reconciliation_id = $1 ORDER BY status DESC, ABS(variance) DESC',
      [recon.id]
    );

    res.json({ reconciliation: recon, items: itemsResult.rows });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/reconciliation/:id — get specific run with items
exports.getById = async (req, res) => {
  try {
    const reconResult = await db.query(
      `SELECT r.*, b.name as branch_name, u.name as run_by_name
       FROM reconciliations r
       LEFT JOIN branches b ON r.branch_id = b.id
       LEFT JOIN users u ON r.run_by = u.id
       WHERE r.id = $1`, [req.params.id]
    );
    if (reconResult.rows.length === 0) return res.status(404).json({ message: 'Not found' });

    const itemsResult = await db.query(
      'SELECT * FROM reconciliation_items WHERE reconciliation_id = $1 ORDER BY status DESC, ABS(variance) DESC',
      [req.params.id]
    );

    res.json({ reconciliation: reconResult.rows[0], items: itemsResult.rows });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/reconciliation/items/:id/resolve — resolve a discrepancy
exports.resolveItem = async (req, res) => {
  const { resolution, resolution_notes, apply_stock_adjustment, branch_id } = req.body;
  const ip = getIP(req);

  try {
    const itemResult = await db.query('SELECT * FROM reconciliation_items WHERE id = $1', [req.params.id]);
    if (itemResult.rows.length === 0) return res.status(404).json({ message: 'Item not found' });
    const item = itemResult.rows[0];

    await db.query(
      `UPDATE reconciliation_items SET resolution=$1, resolution_notes=$2, resolved_by=$3, resolved_at=NOW(), status='resolved'
       WHERE id=$4`,
      [resolution, resolution_notes, req.user.id, req.params.id]
    );

    // Optionally apply stock adjustment
    if (apply_stock_adjustment && item.variance !== 0 && branch_id) {
      const client = await db.pool.connect();
      try {
        await client.query('BEGIN');
        const inv = await client.query('SELECT quantity FROM inventory WHERE product_id=$1 AND branch_id=$2 FOR UPDATE', [item.product_id, branch_id]);
        const currentQty = inv.rows.length > 0 ? inv.rows[0].quantity : 0;
        const newQty = Math.max(0, currentQty - item.variance);
        await client.query(
          `INSERT INTO inventory (product_id, branch_id, quantity) VALUES ($1,$2,$3)
           ON CONFLICT (product_id, branch_id) DO UPDATE SET quantity=$3, last_updated=NOW()`,
          [item.product_id, branch_id, newQty]
        );
        await client.query(
          `INSERT INTO stock_adjustments (product_id, branch_id, user_id, adjustment_type, quantity_change, reason)
           VALUES ($1,$2,$3,'reconciliation',$4,$5)`,
          [item.product_id, branch_id, req.user.id, -item.variance, `Reconciliation: ${resolution}`]
        );
        await client.query('COMMIT');
      } catch (e) {
        await client.query('ROLLBACK');
        throw e;
      } finally {
        client.release();
      }
    }

    await logActivity(req.user.id, 'RECONCILIATION_RESOLVED', `Item ${item.product_name} resolved as: ${resolution}`, ip);
    res.json({ message: 'Discrepancy resolved' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
