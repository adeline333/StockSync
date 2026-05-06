const db = require('./db');

(async () => {
  try {
    console.log('🔍 Checking orders in database...\n');
    
    const orders = await db.query(`
      SELECT o.*, b.name as branch_name, u.name as cashier_name
      FROM orders o
      LEFT JOIN branches b ON o.branch_id = b.id
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC LIMIT 10
    `);
    
    if (orders.rows.length === 0) {
      console.log('❌ NO ORDERS FOUND IN DATABASE!');
      console.log('This means sales are not being saved.');
    } else {
      console.log(`✅ Found ${orders.rows.length} orders:\n`);
      orders.rows.forEach(o => {
        console.log(`  Order: ${o.order_number}`);
        console.log(`  Branch: ${o.branch_name} (ID: ${o.branch_id})`);
        console.log(`  Cashier: ${o.cashier_name}`);
        console.log(`  Total: ${o.total_amount} RWF`);
        console.log(`  Status: ${o.status}`);
        console.log(`  Date: ${o.created_at}`);
        console.log('  ---');
      });
    }

    // Check today's sales specifically
    const today = new Date().toISOString().split('T')[0];
    console.log(`\n📅 Today's date: ${today}`);
    
    const todaySales = await db.query(`
      SELECT COUNT(*) as count, COALESCE(SUM(total_amount), 0) as revenue
      FROM orders 
      WHERE status = 'completed' AND DATE(created_at) = $1
    `, [today]);
    
    console.log(`\n💰 Today's sales: ${todaySales.rows[0].count} orders, ${todaySales.rows[0].revenue} RWF`);

    // Check by branch
    const branchSales = await db.query(`
      SELECT b.name, b.id, COUNT(o.id) as orders, COALESCE(SUM(o.total_amount), 0) as revenue
      FROM branches b
      LEFT JOIN orders o ON o.branch_id = b.id AND o.status = 'completed' AND DATE(o.created_at) = $1
      GROUP BY b.id, b.name
      ORDER BY b.name
    `, [today]);
    
    console.log('\n🏪 Sales by branch today:');
    branchSales.rows.forEach(b => {
      console.log(`  ${b.name}: ${b.orders} orders, ${b.revenue} RWF`);
    });

    process.exit(0);
  } catch (e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
})();
