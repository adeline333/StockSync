const db = require('../db');

const logActivity = async (user_id, action, details, ip) => {
  try {
    await db.query('INSERT INTO activity_logs (user_id, action, details, ip_address) VALUES ($1,$2,$3,$4)', [user_id, action, details, ip]);
  } catch (e) { console.error('Log error:', e.message); }
};
const getIP = (req) => req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

const genOrderNumber = () => {
  const now = new Date();
  return `ORD-${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${Math.floor(Math.random()*9000+1000)}`;
};

// POST /api/sales/orders — create a new order
exports.createOrder = async (req, res) => {
  const { branch_id, customer_id, items, discount_amount = 0, payment_method, amount_tendered, notes } = req.body;
  const ip = getIP(req);
  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    if (!items || items.length === 0) throw new Error('Order must have at least one item');

    // Calculate totals
    let subtotal = 0;
    const enrichedItems = [];

    for (const item of items) {
      const prodResult = await client.query(
        'SELECT id, name, sku, price FROM products WHERE id = $1', [item.product_id]
      );
      if (prodResult.rows.length === 0) throw new Error(`Product ${item.product_id} not found`);
      const product = prodResult.rows[0];

      // Check stock
      const invResult = await client.query(
        'SELECT quantity FROM inventory WHERE product_id = $1 AND branch_id = $2 FOR UPDATE',
        [item.product_id, branch_id]
      );
      const available = invResult.rows.length > 0 ? invResult.rows[0].quantity : 0;
      if (available < item.quantity) throw new Error(`Insufficient stock for ${product.name} (available: ${available})`);

      const lineTotal = parseFloat(product.price) * item.quantity;
      subtotal += lineTotal;
      enrichedItems.push({ ...item, product_name: product.name, product_sku: product.sku, unit_price: product.price, total_price: lineTotal });
    }

    const discountAmt = parseFloat(discount_amount) || 0;
    const afterDiscount = subtotal - discountAmt;
    const vatAmount = parseFloat((afterDiscount * 0.18).toFixed(2));
    const totalAmount = parseFloat((afterDiscount + vatAmount).toFixed(2));
    const changeAmount = amount_tendered ? Math.max(0, parseFloat(amount_tendered) - totalAmount) : 0;

    const orderNumber = genOrderNumber();

    // Insert order
    const orderResult = await client.query(
      `INSERT INTO orders (order_number, branch_id, customer_id, user_id, subtotal, discount_amount, vat_amount, total_amount, payment_method, amount_tendered, change_amount, notes, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'completed') RETURNING *`,
      [orderNumber, branch_id, customer_id || null, req.user.id, subtotal, discountAmt, vatAmount, totalAmount, payment_method || 'cash', amount_tendered || totalAmount, changeAmount, notes || null]
    );
    const order = orderResult.rows[0];

    // Insert items + deduct inventory
    for (const item of enrichedItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, product_sku, quantity, unit_price, total_price)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [order.id, item.product_id, item.product_name, item.product_sku, item.quantity, item.unit_price, item.total_price]
      );

      await client.query(
        'UPDATE inventory SET quantity = quantity - $1, last_updated = NOW() WHERE product_id = $2 AND branch_id = $3',
        [item.quantity, item.product_id, branch_id]
      );

      await client.query(
        `INSERT INTO transactions (product_id, source_branch_id, type, quantity, user_id, status)
         VALUES ($1,$2,'sale',$3,$4,'completed')`,
        [item.product_id, branch_id, item.quantity, req.user.id]
      );
    }

    await client.query('COMMIT');
    await logActivity(req.user.id, 'ORDER_CREATED', `Order ${orderNumber} — RWF ${totalAmount} via ${payment_method}`, ip);

    res.status(201).json({ order, items: enrichedItems });
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('createOrder error:', e.message);
    res.status(400).json({ message: e.message });
  } finally {
    client.release();
  }
};

// GET /api/sales/orders — list orders with filters
exports.getOrders = async (req, res) => {
  const { branch_id, user_id, status, from_date, to_date, search, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  let conditions = [];
  let params = [];
  let idx = 1;

  if (branch_id && branch_id !== 'all') { conditions.push(`o.branch_id = $${idx++}`); params.push(branch_id); }
  if (user_id && user_id !== 'all') { conditions.push(`o.user_id = $${idx++}`); params.push(user_id); }
  if (status && status !== 'all') { conditions.push(`o.status = $${idx++}`); params.push(status); }
  if (from_date) { conditions.push(`o.created_at >= $${idx++}`); params.push(from_date); }
  if (to_date) { conditions.push(`o.created_at <= $${idx++}`); params.push(to_date + ' 23:59:59'); }
  if (search) {
    conditions.push(`(o.order_number ILIKE $${idx} OR c.name ILIKE $${idx})`);
    params.push(`%${search}%`); idx++;
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  try {
    params.push(parseInt(limit), parseInt(offset));
    const result = await db.query(
      `SELECT o.*, u.name as cashier_name, b.name as branch_name, c.name as customer_name
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       LEFT JOIN branches b ON o.branch_id = b.id
       LEFT JOIN customers c ON o.customer_id = c.id
       ${where}
       ORDER BY o.created_at DESC
       LIMIT $${idx} OFFSET $${idx+1}`,
      params
    );

    const countResult = await db.query(
      `SELECT COUNT(*) FROM orders o LEFT JOIN customers c ON o.customer_id = c.id ${where}`,
      params.slice(0, idx - 1)
    );

    res.json({ orders: result.rows, total: parseInt(countResult.rows[0].count) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/sales/orders/:id — get single order with items
exports.getOrderById = async (req, res) => {
  try {
    const orderResult = await db.query(
      `SELECT o.*, u.name as cashier_name, b.name as branch_name, c.name as customer_name, c.phone as customer_phone
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       LEFT JOIN branches b ON o.branch_id = b.id
       LEFT JOIN customers c ON o.customer_id = c.id
       WHERE o.id = $1`, [req.params.id]
    );
    if (orderResult.rows.length === 0) return res.status(404).json({ message: 'Order not found' });

    const itemsResult = await db.query(
      'SELECT * FROM order_items WHERE order_id = $1 ORDER BY id', [req.params.id]
    );

    res.json({ order: orderResult.rows[0], items: itemsResult.rows });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/sales/orders/:id/void — void an order
exports.voidOrder = async (req, res) => {
  const { reason } = req.body;
  const ip = getIP(req);
  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    const orderResult = await client.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    if (orderResult.rows.length === 0) throw new Error('Order not found');
    const order = orderResult.rows[0];
    if (order.status === 'voided') throw new Error('Order already voided');

    // Restore inventory
    const items = await client.query('SELECT * FROM order_items WHERE order_id = $1', [order.id]);
    for (const item of items.rows) {
      await client.query(
        'UPDATE inventory SET quantity = quantity + $1 WHERE product_id = $2 AND branch_id = $3',
        [item.quantity, item.product_id, order.branch_id]
      );
    }

    await client.query('UPDATE orders SET status = $1 WHERE id = $2', ['voided', order.id]);
    await client.query('COMMIT');
    await logActivity(req.user.id, 'ORDER_VOIDED', `Order ${order.order_number} voided. Reason: ${reason || 'N/A'}`, ip);

    res.json({ message: 'Order voided and stock restored' });
  } catch (e) {
    await client.query('ROLLBACK');
    res.status(400).json({ message: e.message });
  } finally {
    client.release();
  }
};

// GET /api/sales/summary — daily summary
exports.getDailySummary = async (req, res) => {
  const { branch_id, date } = req.query;
  const targetDate = date || new Date().toISOString().split('T')[0];
  const branchFilter = branch_id ? `AND o.branch_id = ${parseInt(branch_id)}` : '';

  try {
    const summary = await db.query(
      `SELECT 
        COUNT(*) as total_transactions,
        COALESCE(SUM(total_amount), 0) as total_revenue,
        COALESCE(SUM(CASE WHEN payment_method = 'cash' THEN total_amount ELSE 0 END), 0) as cash_total,
        COALESCE(SUM(CASE WHEN payment_method = 'momo' THEN total_amount ELSE 0 END), 0) as momo_total,
        COALESCE(SUM(CASE WHEN payment_method = 'card' THEN total_amount ELSE 0 END), 0) as card_total,
        COUNT(CASE WHEN status = 'voided' THEN 1 END) as voided_count
       FROM orders o
       WHERE DATE(o.created_at) = $1 AND o.status != 'voided' ${branchFilter}`,
      [targetDate]
    );

    res.json({ summary: summary.rows[0], date: targetDate });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};
