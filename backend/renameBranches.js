const db = require('./db');

async function renameBranches() {
  try {
    // Rename Remera (ID 3) to Central Warehouse
    await db.query(
      'UPDATE branches SET name = $1 WHERE id = $2', 
      ['Central Warehouse (Kigali Industrial Zone)', 3]
    );
    
    // Delete the old Central Warehouse (ID 1)
    await db.query('DELETE FROM branches WHERE id = $1', [1]);
    
    console.log('✅ Successfully renamed branches:');
    console.log('   - Remera → Central Warehouse (Kigali Industrial Zone)');
    console.log('   - Deleted old Central Warehouse');
    
    // Show updated branches
    const result = await db.query('SELECT id, name FROM branches ORDER BY id');
    console.log('\n📋 Updated branches:');
    result.rows.forEach(b => console.log(`   ID ${b.id}: ${b.name}`));
    
    process.exit(0);
  } catch (e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
}

renameBranches();