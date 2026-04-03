const db = require('../db');

const logActivity = async (user_id, action, details, ip) => {
  try {
    await db.query('INSERT INTO activity_logs (user_id, action, details, ip_address) VALUES ($1,$2,$3,$4)', [user_id, action, details, ip]);
  } catch (e) { console.error('Log error:', e.message); }
};
const getIP = (req) => req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
const genTransferNumber = () => `TR-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

// GET /api/transfers — list transfers with filters
exports.getTransfers = async (req, res) => {
  const { status, branch_id } = req.query;
  let conditions = [];
  let params = [];
  let idx = 1;

  if (status && status !== 'all') { conditions.push(`st.status = $${idx++}`); params.push(status); }
  if (branch_id) {
    conditions.push(`(st.source_branch_id = $${idx} OR st.dest_branch_id = $${idx})`);
    params.push(branch_id); idx++;
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  try {
    const result = await db.query(
      `SELECT st.*, 
        sb.name as source_branch_name, db.name as dest_branch_name,
        u.name as requested_by_name, a.name as approved_by_name
       FROM stock_transfers st
       LEFT JOIN branches sb ON st.source_branch_id = sb.id
       LEFT JOIN branches db ON st.dest_branch_id = db.id
       LEFT JOIN users u ON st.requested_by = u.id
       LEFT JOIN users a ON st.approved_by = a.id
       ${where}
       ORDER BY st.created_at DESC LIMIT 100`,
      params
    );
    res.json({ transfers: result.rows });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/transfers/:id
exports.getTransferById = async (req, res) => {
  try {
    const transferResult = await db.query(
      `SELECT st.*, 
        sb.name as source_branch_name, db.name as dest_branch_name,
        u.name as requested_by_name, a.name as approved_by_name
       FROM stock_transfers st
       LEFT JOIN branches sb ON st.source_branch_id = sb.id
       LEFT JOIN branches db ON st.dest_branch_id = db.id
       LEFT JOIN users u ON st.requested_by = u.id
       LEFT JOIN users a ON st.approved_by = a.id
       WHERE st.id = $1`, [req.params.id]
    );
    if (transferResult.rows.length === 0) return res.status(404).json({ message: 'Transfer not found' });

    const itemsResult = await db.query(
      `SELECT sti.*, p.name as product_name, p.sku,
        COALESCE((SELECT quantity FROM inventory WHERE product_id = p.id AND branch_id = $2), 0) as source_stock
       FROM stock_transfer_items sti
       JOIN products p ON sti.product_id = p.id
       WHERE sti.transfer_id = $1`,
      [req.params.id, transferResult.rows[0].source_branch_id]
    );

    res.json({ transfer: transferResult.rows[0], items: itemsResult.rows });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/transfers — create transfer request
exports.createTransfer = async (req, res) => {
  const { source_branch_id, dest_branch_id, items, reason, priority, notes } = req.body;
  const ip = getIP(req);

  if (!items || items.length === 0) return res.status(400).json({ message: 'Add at least one item' });
  if (source_branch_id === dest_branch_id) return res.status(400).json({ message: 'Source and destination cannot be the same' });

  try {
    const transferNumber = genTransferNumber();
    const result = await db.query(
      `INSERT INTO stock_transfers (transfer_number, source_branch_id, dest_branch_id, requested_by, status, priority, reason, notes)
       VALUES ($1,$2,$3,$4,'pending',$5,$6,$7) RETURNING *`,
      [transferNumber, source_branch_id, dest_branch_id, req.user.id, priority || 'normal', reason || null, notes || null]
    );
    const transfer = result.rows[0];

    for (const item of items) {
      await db.query(
        'INSERT INTO stock_transfer_items (transfer_id, product_id, quantity) VALUES ($1,$2,$3)',
        [transfer.id, item.product_id, item.quantity]
      );
    }

    await logActivity(req.user.id, 'TRANSFER_REQUESTED', `Transfer ${transferNumber} from branch ${source_branch_id} to ${dest_branch_id}`, ip);
    res.status(201).json({ transfer });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/transfers/:id/approve
exports.approveTransfer = async (req, res) => {
  const ip = getIP(req);
  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    const transferResult = await client.query('SELECT * FROM stock_transfers WHERE id = $1 FOR UPDATE', [req.params.id]);
    if (transferResult.rows.length === 0) throw new Error('Transfer not found');
    const transfer = transferResult.rows[0];
    if (transfer.status !== 'pending') throw new Error(`Transfer is already ${transfer.status}`);

    const items = await client.query('SELECT * FROM stock_transfer_items WHERE transfer_id = $1', [transfer.id]);

    // Check and move stock
    for (const item of items.rows) {
      const inv = await client.query(
        'SELECT quantity FROM inventory WHERE product_id=$1 AND branch_id=$2 FOR UPDATE',
        [item.product_id, transfer.source_branch_id]
      );
      const available = inv.rows.length > 0 ? inv.rows[0].quantity : 0;
      if (available < item.quantity) {
        const prod = await client.query('SELECT name FROM products WHERE id=$1', [item.product_id]);
        throw new Error(`Insufficient stock for ${prod.rows[0]?.name} (available: ${available}, requested: ${item.quantity})`);
      }

      // Deduct from source
      await client.query(
        'UPDATE inventory SET quantity = quantity - $1, last_updated = NOW() WHERE product_id=$2 AND branch_id=$3',
        [item.quantity, item.product_id, transfer.source_branch_id]
      );

      // Add to destination
      await client.query(
        `INSERT INTO inventory (product_id, branch_id, quantity) VALUES ($1,$2,$3)
         ON CONFLICT (product_id, branch_id) DO UPDATE SET quantity = inventory.quantity + $3, last_updated = NOW()`,
        [item.product_id, transfer.dest_branch_id, item.quantity]
      );

      // Log transaction
      await client.query(
        `INSERT INTO transactions (product_id, source_branch_id, dest_branch_id, type, quantity, user_id, status)
         VALUES ($1,$2,$3,'transfer',$4,$5,'completed')`,
        [item.product_id, transfer.source_branch_id, transfer.dest_branch_id, item.quantity, req.user.id]
      );
    }

    await client.query(
      'UPDATE stock_transfers SET status=$1, approved_by=$2, updated_at=NOW() WHERE id=$3',
      ['approved', req.user.id, transfer.id]
    );

    await client.query('COMMIT');
    await logActivity(req.user.id, 'TRANSFER_APPROVED', `Transfer ${transfer.transfer_number} approved`, ip);
    res.json({ message: 'Transfer approved and stock moved' });
  } catch (e) {
    await client.query('ROLLBACK');
    res.status(400).json({ message: e.message });
  } finally {
    client.release();
  }
};

// POST /api/transfers/:id/reject
exports.rejectTransfer = async (req, res) => {
  const { reason } = req.body;
  const ip = getIP(req);
  try {
    const result = await db.query('SELECT * FROM stock_transfers WHERE id=$1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Transfer not found' });
    if (result.rows[0].status !== 'pending') return res.status(400).json({ message: 'Transfer is not pending' });

    await db.query(
      'UPDATE stock_transfers SET status=$1, rejected_reason=$2, approved_by=$3, updated_at=NOW() WHERE id=$4',
      ['rejected', reason || null, req.user.id, req.params.id]
    );
    await logActivity(req.user.id, 'TRANSFER_REJECTED', `Transfer ${result.rows[0].transfer_number} rejected. Reason: ${reason || 'N/A'}`, ip);
    res.json({ message: 'Transfer rejected' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/transfers/locations/summary — per-branch stock summary
exports.getLocationsSummary = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT b.id, b.name, b.location, b.branch_type, b.manager_name, b.latitude, b.longitude,
        COALESCE(SUM(i.quantity), 0) as total_items,
        COALESCE(SUM(i.quantity * p.price), 0) as stock_value,
        COUNT(CASE WHEN i.quantity <= i.min_stock_level AND i.quantity > 0 THEN 1 END) as low_stock_count,
        COUNT(CASE WHEN i.quantity = 0 THEN 1 END) as out_of_stock_count
       FROM branches b
       LEFT JOIN inventory i ON b.id = i.branch_id
       LEFT JOIN products p ON i.product_id = p.id
       WHERE b.is_active = TRUE
       GROUP BY b.id ORDER BY b.name`
    );
    res.json({ locations: result.rows });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};
