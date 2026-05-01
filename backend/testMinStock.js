require('dotenv').config();
const db = require('./db');

async function testMinStock() {
  try {
    console.log('Testing min_stock_level column...\n');

    // Check if column exists in products table
    const columnsCheck = await db.query(`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'products' AND column_name = 'min_stock_level'
    `);

    if (columnsCheck.rows.length === 0) {
      console.log('❌ min_stock_level column does NOT exist in products table');
      console.log('   Run: node migrateProductMinStock.js');
      process.exit(1);
    }

    console.log('✅ min_stock_level column exists in products table');
    console.log('   Type:', columnsCheck.rows[0].data_type);
    console.log('   Default:', columnsCheck.rows[0].column_default);

    // Check products
    const products = await db.query('SELECT id, name, min_stock_level FROM products LIMIT 5');
    console.log('\n📦 Sample products:');
    products.rows.forEach(p => {
      console.log(`   ID ${p.id}: ${p.name} - Min Stock: ${p.min_stock_level}`);
    });

    // Test update
    if (products.rows.length > 0) {
      const testProduct = products.rows[0];
      console.log(`\n🧪 Testing update on product ${testProduct.id}...`);
      
      await db.query(
        'UPDATE products SET min_stock_level = $1 WHERE id = $2',
        [15, testProduct.id]
      );
      
      const updated = await db.query('SELECT min_stock_level FROM products WHERE id = $1', [testProduct.id]);
      console.log(`✅ Update successful! New value: ${updated.rows[0].min_stock_level}`);
      
      // Revert
      await db.query(
        'UPDATE products SET min_stock_level = $1 WHERE id = $2',
        [testProduct.min_stock_level, testProduct.id]
      );
      console.log('✅ Reverted to original value');
    }

    console.log('\n✨ All tests passed!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testMinStock();
