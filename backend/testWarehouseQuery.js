const db = require('./db');

async function testWarehouseQuery() {
  try {
    // Simulate manager user with branch_id = 3
    const branch_id = 3;
    const bf = branch_id ? `AND i.branch_id = ${parseInt(branch_id)}` : '';
    
    console.log('🔍 Testing warehouse dashboard query...');
    console.log('Branch ID:', branch_id);
    console.log('Filter string:', bf);
    
    // Test the exact query from warehouse dashboard
    const query = `SELECT COALESCE(SUM(i.quantity), 0) as total FROM inventory i WHERE 1=1 ${bf}`;
    console.log('Full query:', query);
    
    const result = await db.query(query);
    console.log('Query result:', result.rows[0]);
    
    // Also test without the filter to see all stock
    const allStock = await db.query('SELECT COALESCE(SUM(i.quantity), 0) as total FROM inventory i');
    console.log('All stock (no filter):', allStock.rows[0]);
    
    // Test critical stock query
    const criticalQuery = `SELECT COUNT(*) as count FROM inventory i WHERE i.quantity <= i.min_stock_level AND i.quantity > 0 ${bf}`;
    console.log('Critical stock query:', criticalQuery);
    const criticalResult = await db.query(criticalQuery);
    console.log('Critical stock result:', criticalResult.rows[0]);
    
    process.exit(0);
  } catch (e) {
    console.error('❌ Error:', e.message);
    console.error('Full error:', e);
    process.exit(1);
  }
}

testWarehouseQuery();