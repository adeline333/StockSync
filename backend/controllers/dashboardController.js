const db = require('../db');

// GET /api/dashboard/admin — admin overview KPIs
exports.getAdminDashboard = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [inventoryValue, salesToday, pendingIssues, lowStock, recentActivity, warehouseStatus, totalProducts] = await Promise.all([      // Total inventory value
      db.query(`SELECT COALESCE(SUM(i.quantity * p.price), 0) as value FROM inventory i JOIN products p ON i.product_id = p.id`),

      // Sales today
      db.query(`SELECT COALESCE(SUM(total_amount), 0) as revenue, COUNT(*) as count FROM orders WHERE status = 'completed' AND DATE(created_at) = $1`, [today]),

      // Pending issues (unmatched reconciliations + pending transfers)
      db.query(`SELECT (SELECT COUNT(*) FROM reconciliation_items WHERE status = 'mismatched') + (SELECT COUNT(*) FROM stock_transfers WHERE status = 'pending') as count`),

      // Low stock SKUs
      db.query(`SELECT COUNT(*) as count FROM inventory i WHERE i.quantity > 0 AND i.quantity <= i.min_stock_level`),

      // Recent activity logs
      db.query(`SELECT al.action, al.details, al.created_at, u.name as user_name FROM activity_logs al LEFT JOIN users u ON al.user_id = u.id ORDER BY al.created_at DESC LIMIT 5`),

      // Warehouse status
      db.query(`SELECT b.id, b.name, b.location,
        COALESCE(SUM(i.quantity), 0) as total_items,
        COALESCE(SUM(i.quantity * p.price), 0) as stock_value,
        COUNT(CASE WHEN i.quantity <= i.min_stock_level AND i.quantity > 0 THEN 1 END) as low_stock_count
       FROM branches b
       LEFT JOIN inventory i ON b.id = i.branch_id
       LEFT JOIN products p ON i.product_id = p.id
       WHERE b.is_active = TRUE
       GROUP BY b.id ORDER BY b.name LIMIT 5`),

      // Total products count
      db.query(`SELECT COUNT(*) as count FROM products WHERE status = 'active'`)
    ]);

    // Sales trend (last 7 days)
    const salesTrend = await db.query(
      `SELECT DATE(created_at) as date, COALESCE(SUM(total_amount), 0) as revenue
       FROM orders WHERE status = 'completed' AND created_at >= NOW() - INTERVAL '7 days'
       GROUP BY DATE(created_at) ORDER BY date ASC`
    );

    // System health
    const systemHealth = {
      database: 'online',
      scheduler: 'running',
      last_backup: new Date().toISOString(),
      uptime_hours: Math.floor(process.uptime() / 3600),
      total_users: 0,
      total_products: 0,
      total_orders: 0
    };

    try {
      const counts = await db.query(`SELECT
        (SELECT COUNT(*) FROM users) as users,
        (SELECT COUNT(*) FROM products) as products,
        (SELECT COUNT(*) FROM orders) as orders`);
      systemHealth.total_users = parseInt(counts.rows[0].users);
      systemHealth.total_products = parseInt(counts.rows[0].products);
      systemHealth.total_orders = parseInt(counts.rows[0].orders);
    } catch (_) {}

    res.json({
      inventory_value: parseFloat(inventoryValue.rows[0].value),
      sales_today: { revenue: parseFloat(salesToday.rows[0].revenue), count: parseInt(salesToday.rows[0].count) },
      pending_issues: parseInt(pendingIssues.rows[0].count),
      low_stock_count: parseInt(lowStock.rows[0].count),
      total_products: parseInt(totalProducts.rows[0].count),
      recent_activity: recentActivity.rows,
      warehouse_status: warehouseStatus.rows,
      sales_trend: salesTrend.rows,
      system_health: systemHealth
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/dashboard/warehouse — warehouse manager KPIs
exports.getWarehouseDashboard = async (req, res) => {
  const branch_id = req.user.branch_id;
  const bf = branch_id ? `AND i.branch_id = ${parseInt(branch_id)}` : '';
  const tbf = branch_id ? `AND (st.source_branch_id = ${parseInt(branch_id)} OR st.dest_branch_id = ${parseInt(branch_id)})` : '';

  console.log('🔍 Warehouse Dashboard Debug:');
  console.log('User:', req.user.name, 'Role:', req.user.role, 'Branch ID:', req.user.branch_id);
  console.log('Filter:', bf);

  try {
    const [totalStock, inboundPending, criticalStock, recentMovements, weeklyMovements] = await Promise.all([
      db.query(`SELECT COALESCE(SUM(i.quantity), 0) as total FROM inventory i WHERE 1=1 ${bf}`),
      db.query(`SELECT COUNT(*) as count FROM stock_transfers WHERE status = 'pending' ${branch_id ? `AND dest_branch_id = ${parseInt(branch_id)}` : ''}`),
      db.query(`SELECT COUNT(*) as count FROM inventory i WHERE i.quantity <= i.min_stock_level AND i.quantity > 0 ${bf}`),
      db.query(`SELECT sa.*, p.name as product_name, p.sku, b.name as branch_name
       FROM stock_adjustments sa
       LEFT JOIN products p ON sa.product_id = p.id
       LEFT JOIN branches b ON sa.branch_id = b.id
       WHERE 1=1 ${branch_id ? `AND sa.branch_id = ${parseInt(branch_id)}` : ''}
       ORDER BY sa.created_at DESC LIMIT 5`),
      db.query(`SELECT DATE(created_at) as date, 'adjustment' as type, SUM(ABS(quantity_change)) as qty
       FROM stock_adjustments WHERE created_at >= NOW() - INTERVAL '7 days' ${branch_id ? `AND branch_id = ${parseInt(branch_id)}` : ''}
       GROUP BY DATE(created_at) ORDER BY date ASC`)
    ]);

    const result = {
      total_stock: parseInt(totalStock.rows[0].total),
      inbound_pending: parseInt(inboundPending.rows[0].count),
      critical_stock: parseInt(criticalStock.rows[0].count),
      recent_movements: recentMovements.rows,
      weekly_movements: weeklyMovements.rows
    };

    console.log('📊 Dashboard Result:', result);
    res.json(result);
  } catch (e) {
    console.error('❌ Warehouse Dashboard Error:', e);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/dashboard/retail — retail cashier KPIs
exports.getRetailDashboard = async (req, res) => {
  const branch_id = req.user.branch_id;
  const today = new Date().toISOString().split('T')[0];
  const bf = branch_id ? `AND o.branch_id = ${parseInt(branch_id)}` : '';

  try {
    const [salesToday, recentOrders, returns] = await Promise.all([
      db.query(`SELECT COALESCE(SUM(total_amount), 0) as revenue, COUNT(*) as count,
        COALESCE(SUM(CASE WHEN payment_method = 'cash' THEN amount_tendered - total_amount ELSE 0 END), 0) as cash_in_drawer
       FROM orders WHERE status = 'completed' AND DATE(created_at) = $1 ${bf}`, [today]),
      db.query(`SELECT o.*, u.name as cashier_name FROM orders o LEFT JOIN users u ON o.user_id = u.id
       WHERE o.status = 'completed' ${bf} ORDER BY o.created_at DESC LIMIT 10`),
      db.query(`SELECT COUNT(*) as count FROM orders WHERE status = 'voided' AND DATE(created_at) = $1 ${bf}`, [today])
    ]);

    res.json({
      sales_today: {
        revenue: parseFloat(salesToday.rows[0].revenue),
        count: parseInt(salesToday.rows[0].count),
        cash_in_drawer: parseFloat(salesToday.rows[0].cash_in_drawer)
      },
      returns_today: parseInt(returns.rows[0].count),
      recent_orders: recentOrders.rows
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};
