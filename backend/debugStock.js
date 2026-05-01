const db = require('./db');

async function debugStock() {
  try {
    // Check manager info
    const manager = await db.query(
      'SELECT u.name, u.role, u.branch_id, b.name as branch_name FROM users u LEFT JOIN branches b ON u.branch_id = b.id WHERE u.role = $1', 
      ['manager']
    );
    console.log('👤 Manager info:', manager.rows[0]);
    
    // Check stock in manager's branch
    const managerBranchId = manager.rows[0].branch_id;
    const stock = await db.query(
      'SELECT COUNT(*) as count, SUM(quantity) as total FROM inventory WHERE branch_id = $1', 
      [managerBranchId]
    );
    console.log('📦 Stock in manager branch (ID ' + managerBranchId + '):', stock.rows[0]);
    
    // Check all inventory records
    const allStock = await db.query(
      'SELECT i.*, p.name as product_name, b.name as branch_name FROM inventory i LEFT JOIN products p ON i.product_id = p.id LEFT JOIN branches b ON i.branch_id = b.id ORDER BY i.branch_id'
    );
    console.log('\n📋 All inventory records:');
    allStock.rows.forEach(s => console.log(`   ${s.product_name} - ${s.quantity} units in ${s.branch_name} (branch_id: ${s.branch_id})`));
    
    // Check all branches
    const branches = await db.query('SELECT * FROM branches ORDER BY id');
    console.log('\n🏢 All branches:');
    branches.rows.forEach(b => console.log(`   ID ${b.id}: ${b.name} (active: ${b.is_active})`));
    
    process.exit(0);
  } catch (e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
}

debugStock();