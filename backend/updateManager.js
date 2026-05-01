const db = require('./db');

async function updateManager() {
  try {
    // Update manager's branch to new Central Warehouse (ID 3)
    await db.query('UPDATE users SET branch_id = 3 WHERE role = $1', ['manager']);
    
    console.log('✅ Updated manager branch assignment to Central Warehouse (ID 3)');
    
    // Show updated user assignments
    const result = await db.query(
      'SELECT u.name, u.role, u.branch_id, b.name as branch_name FROM users u LEFT JOIN branches b ON u.branch_id = b.id WHERE u.role IN ($1, $2) ORDER BY u.role', 
      ['admin', 'manager']
    );
    
    console.log('\n📋 Updated user assignments:');
    result.rows.forEach(u => console.log(`   ${u.name} (${u.role}): ${u.branch_name || 'No branch'}`));
    
    process.exit(0);
  } catch (e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
}

updateManager();