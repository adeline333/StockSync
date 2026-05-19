const db = require('../db');

exports.getSalesReport = async (req, res) => {
  const { from_date, to_date, branch_id } = req.query;
  const start = from_date || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  const end = to_date || new Date().toISOString().split('T')[0];
  
  let finalBranchId = branch_id;
  if (req.user.role === 'manager' || req.user.role === 'staff') {
    finalBranchId = req.user.branch_id;
  }
  const bf = finalBranchId ? `AND o.branch_id = ${parseInt(finalBranchId)}` : '';

  try {
    const daily = await db.query(
      `SELECT DATE(o.created_at) as date,
        COUNT(*) as transactions,
        COALESCE(SUM(o.total_amount), 0) as revenue,
        COALESCE(SUM(o.vat_amount), 0) as vat,
        COALESCE(SUM(o.discount_amount), 0) as discounts
       FROM orders o
       WHERE o.status = 'completed' AND DATE(o.created_at) BETWEEN $1 AND $2 ${bf}
       GROUP BY DATE(o.created_at) ORDER BY date ASC`,
      [start, end]
    );

    const summary = await db.query(
      `SELECT COUNT(*) as total_transactions,
        COALESCE(SUM(o.total_amount), 0) as total_revenue,
        COALESCE(SUM(o.vat_amount), 0) as total_vat,
        COALESCE(SUM(o.discount_amount), 0) as total_discounts,
        COALESCE(AVG(o.total_amount), 0) as avg_order_value,
        COUNT(CASE WHEN o.payment_method = 'cash' THEN 1 END) as cash_count,
        COUNT(CASE WHEN o.payment_method = 'momo' THEN 1 END) as momo_count,
        COUNT(CASE WHEN o.payment_method = 'card' THEN 1 END) as card_count
       FROM orders o
       WHERE o.status = 'completed' AND DATE(o.created_at) BETWEEN $1 AND $2 ${bf}`,
      [start, end]
    );

    const topProducts = await db.query(
      `SELECT oi.product_name, oi.product_sku,
        SUM(oi.quantity) as units_sold, SUM(oi.total_price) as revenue
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       WHERE o.status = 'completed' AND DATE(o.created_at) BETWEEN $1 AND $2 ${bf}
       GROUP BY oi.product_name, oi.product_sku
       ORDER BY revenue DESC LIMIT 10`,
      [start, end]
    );

    const cogs = await db.query(
      `SELECT COALESCE(SUM(oi.quantity * p.cost_price), 0) as total_cogs
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       JOIN products p ON oi.product_id = p.id
       WHERE o.status = 'completed' AND DATE(o.created_at) BETWEEN $1 AND $2 ${bf}`,
      [start, end]
    );

    res.json({
      period: { start, end },
      summary: summary.rows[0],
      cogs: parseFloat(cogs.rows[0].total_cogs),
      daily: daily.rows,
      topProducts: topProducts.rows
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getInventoryReport = async (req, res) => {
  const { branch_id } = req.query;
  
  let finalBranchId = branch_id;
  if (req.user.role === 'manager' || req.user.role === 'staff') {
    finalBranchId = req.user.branch_id;
  }
  const bf = finalBranchId ? `AND i.branch_id = ${parseInt(finalBranchId)}` : '';

  try {
    const summary = await db.query(
      `SELECT COUNT(DISTINCT p.id) as total_skus,
        COALESCE(SUM(i.quantity), 0) as total_units,
        COALESCE(SUM(i.quantity * p.price), 0) as retail_value,
        COALESCE(SUM(i.quantity * p.cost_price), 0) as cost_value,
        COUNT(CASE WHEN i.quantity = 0 THEN 1 END) as out_of_stock,
        COUNT(CASE WHEN i.quantity > 0 AND i.quantity <= i.min_stock_level THEN 1 END) as low_stock
       FROM inventory i JOIN products p ON i.product_id = p.id WHERE 1=1 ${bf}`
    );

    const byCategory = await db.query(
      `SELECT p.category, COUNT(DISTINCT p.id) as skus,
        SUM(i.quantity) as units, SUM(i.quantity * p.price) as value
       FROM inventory i JOIN products p ON i.product_id = p.id
       WHERE p.category IS NOT NULL ${bf}
       GROUP BY p.category ORDER BY value DESC`
    );

    const lowStockItems = await db.query(
      `SELECT p.name, p.sku, p.category, i.quantity, i.min_stock_level, b.name as branch_name
       FROM inventory i
       JOIN products p ON i.product_id = p.id
       JOIN branches b ON i.branch_id = b.id
       WHERE i.quantity <= i.min_stock_level AND i.quantity > 0 ${bf}
       ORDER BY i.quantity ASC LIMIT 20`
    );

    res.json({ summary: summary.rows[0], byCategory: byCategory.rows, lowStockItems: lowStockItems.rows });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSettings = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM system_settings LIMIT 1');
    if (result.rows.length === 0) {
      return res.json({
        settings: {
          company_name: 'B SPECIAL BUSINESS LTD',
          support_phone: '+250 788 123 456',
          address: 'Prime Economic Zone, Kigali, Rwanda',
          timezone: 'Africa/Kigali',
          currency: 'RWF',
          vat_rate: 18,
          prices_tax_inclusive: true,
          last_backup: null
        }
      });
    }
    res.json({ settings: result.rows[0] });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.saveSettings = async (req, res) => {
  const { company_name, support_phone, address, timezone, vat_rate, prices_tax_inclusive } = req.body;
  try {
    await db.query(
      `INSERT INTO system_settings (id, company_name, support_phone, address, timezone, vat_rate, prices_tax_inclusive)
       VALUES (1, $1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE SET
         company_name=$1, support_phone=$2, address=$3, timezone=$4,
         vat_rate=$5, prices_tax_inclusive=$6, updated_at=NOW()`,
      [company_name, support_phone, address, timezone, vat_rate, prices_tax_inclusive]
    );
    res.json({ message: 'Settings saved' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTransfersReport = async (req, res) => {
  const { from_date, to_date, branch_id } = req.query;
  const start = from_date || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  const end = to_date || new Date().toISOString().split('T')[0];

  let finalBranchId = branch_id;
  if (req.user.role === 'manager' || req.user.role === 'staff') {
    finalBranchId = req.user.branch_id;
  }

  let bf = '';
  if (finalBranchId) {
    bf = `AND (st.source_branch_id = ${parseInt(finalBranchId)} OR st.dest_branch_id = ${parseInt(finalBranchId)})`;
  }

  try {
    const summary = await db.query(
      `SELECT 
        COUNT(*) as total_transfers,
        COUNT(CASE WHEN st.status = 'completed' THEN 1 END) as completed_transfers,
        COUNT(CASE WHEN st.status = 'pending' THEN 1 END) as pending_transfers,
        COUNT(CASE WHEN st.status = 'in_transit' THEN 1 END) as transit_transfers,
        COALESCE(SUM((SELECT SUM(quantity) FROM stock_transfer_items WHERE transfer_id = st.id)), 0) as total_items_moved
       FROM stock_transfers st
       WHERE DATE(st.created_at) BETWEEN $1 AND $2 ${bf}`,
      [start, end]
    );

    const list = await db.query(
      `SELECT 
        st.id,
        st.transfer_number as transfer_no,
        DATE(st.created_at) as date,
        sb.name as source_branch,
        db.name as dest_branch,
        st.status,
        COALESCE((SELECT SUM(quantity) FROM stock_transfer_items WHERE transfer_id = st.id), 0) as total_items,
        u.name as requested_by
       FROM stock_transfers st
       JOIN branches sb ON st.source_branch_id = sb.id
       JOIN branches db ON st.dest_branch_id = db.id
       LEFT JOIN users u ON st.requested_by = u.id
       WHERE DATE(st.created_at) BETWEEN $1 AND $2 ${bf}
       ORDER BY st.created_at DESC`,
      [start, end]
    );

    res.json({
      period: { start, end },
      summary: summary.rows[0],
      transfers: list.rows
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};
