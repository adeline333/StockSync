const db = require('../db');

const logActivity = async (user_id, action, details, ip) => {
  try {
    await db.query('INSERT INTO activity_logs (user_id, action, details, ip_address) VALUES ($1,$2,$3,$4)', [user_id, action, details, ip]);
  } catch (e) { console.error('Log error:', e.message); }
};
const getIP = (req) => req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

// GET /api/customers
exports.getCustomers = async (req, res) => {
  const { search, customer_type, tin_status, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  let conditions = [];
  let params = [];
  let idx = 1;

  if (search) {
    conditions.push(`(c.name ILIKE $${idx} OR c.phone ILIKE $${idx} OR c.tin ILIKE $${idx} OR c.email ILIKE $${idx})`);
    params.push(`%${search}%`); idx++;
  }
  if (customer_type && customer_type !== 'all') {
    conditions.push(`c.customer_type = $${idx++}`);
    params.push(customer_type);
  }
  if (tin_status === 'missing') {
    conditions.push(`(c.tin IS NULL OR c.tin = '')`);
  } else if (tin_status === 'verified') {
    conditions.push(`c.tin_verified = TRUE`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  params.push(parseInt(limit), parseInt(offset));

  try {
    const result = await db.query(
      `SELECT c.*,
        COALESCE(SUM(o.total_amount), 0) as lifetime_spend,
        COUNT(DISTINCT o.id) as total_orders
       FROM customers c
       LEFT JOIN orders o ON o.customer_id = c.id AND o.status = 'completed'
       ${where}
       GROUP BY c.id
       ORDER BY c.created_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      params
    );

    const countResult = await db.query(`SELECT COUNT(*) FROM customers c ${where}`, params.slice(0, idx - 1));

    const stats = await db.query(
      `SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN tin_verified = TRUE THEN 1 END) as verified_tins,
        COUNT(CASE WHEN tin IS NULL OR tin = '' THEN 1 END) as missing_tins
       FROM customers`
    );

    res.json({
      customers: result.rows,
      total: parseInt(countResult.rows[0].count),
      stats: stats.rows[0]
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/customers/:id
exports.getCustomerById = async (req, res) => {
  try {
    const customerResult = await db.query('SELECT * FROM customers WHERE id = $1', [req.params.id]);
    if (customerResult.rows.length === 0) return res.status(404).json({ message: 'Customer not found' });

    const ordersResult = await db.query(
      `SELECT o.*, 
        COALESCE(STRING_AGG(DISTINCT oi.product_name, ', '), 'N/A') as items_summary
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.customer_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC
       LIMIT 20`,
      [req.params.id]
    );

    const statsResult = await db.query(
      `SELECT 
        COALESCE(SUM(total_amount), 0) as lifetime_spend,
        COUNT(*) as total_orders
       FROM orders WHERE customer_id = $1 AND status = 'completed'`,
      [req.params.id]
    );

    res.json({
      customer: customerResult.rows[0],
      orders: ordersResult.rows,
      stats: statsResult.rows[0]
    });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/customers
exports.createCustomer = async (req, res) => {
  const { name, phone, email, tin, address, customer_type, credit_limit, notes } = req.body;
  const ip = getIP(req);
  try {
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const result = await db.query(
      `INSERT INTO customers (name, phone, email, tin, address, customer_type, credit_limit, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [name, phone || null, email || null, tin || null, address || null,
       customer_type || 'retail', credit_limit || 0, notes || null]
    );

    await logActivity(req.user.id, 'CUSTOMER_CREATED', `Created customer: ${name}`, ip);
    res.status(201).json({ customer: result.rows[0] });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/customers/:id
exports.updateCustomer = async (req, res) => {
  const { name, phone, email, tin, tin_verified, address, customer_type, credit_limit, notes } = req.body;
  const ip = getIP(req);
  try {
    const result = await db.query(
      `UPDATE customers SET name=$1, phone=$2, email=$3, tin=$4, tin_verified=$5,
        address=$6, customer_type=$7, credit_limit=$8, notes=$9
       WHERE id=$10 RETURNING *`,
      [name, phone || null, email || null, tin || null, tin_verified || false,
       address || null, customer_type || 'retail', credit_limit || 0, notes || null, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Customer not found' });
    await logActivity(req.user.id, 'CUSTOMER_UPDATED', `Updated customer ID: ${req.params.id}`, ip);
    res.json({ customer: result.rows[0] });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/customers/:id
exports.deleteCustomer = async (req, res) => {
  const ip = getIP(req);
  try {
    await db.query('DELETE FROM customers WHERE id = $1', [req.params.id]);
    await logActivity(req.user.id, 'CUSTOMER_DELETED', `Deleted customer ID: ${req.params.id}`, ip);
    res.json({ message: 'Customer deleted' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/customers/export/csv
exports.exportCSV = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT c.name, c.phone, c.email, c.tin, c.tin_verified, c.address,
        c.customer_type, c.credit_limit, c.credit_used,
        COALESCE(SUM(o.total_amount), 0) as lifetime_spend,
        COUNT(DISTINCT o.id) as total_orders
       FROM customers c
       LEFT JOIN orders o ON o.customer_id = c.id AND o.status = 'completed'
       GROUP BY c.id ORDER BY c.name`
    );

    const headers = ['Name', 'Phone', 'Email', 'TIN', 'TIN Verified', 'Address', 'Type', 'Credit Limit', 'Credit Used', 'Lifetime Spend', 'Total Orders'];
    const rows = result.rows.map(c => [
      c.name, c.phone || '', c.email || '', c.tin || '', c.tin_verified,
      c.address || '', c.customer_type, c.credit_limit, c.credit_used,
      c.lifetime_spend, c.total_orders
    ]);

    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=customers.csv');
    res.send(csv);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};
