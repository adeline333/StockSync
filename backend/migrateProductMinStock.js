require('dotenv').config();
const db = require('./db');

async function migrateProductMinStock() {
  try {
    console.log('🔄 Adding min_stock_level to products table...');

    // Add min_stock_level column to products table
    await db.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS min_stock_level INTEGER DEFAULT 10
    `);

    console.log('✅ Added min_stock_level column to products table');

    // Migrate existing min_stock_level from inventory to products
    // Take the first branch's min_stock_level as the product's global level
    await db.query(`
      UPDATE products p
      SET min_stock_level = (
        SELECT i.min_stock_level 
        FROM inventory i 
        WHERE i.product_id = p.id 
        LIMIT 1
      )
      WHERE EXISTS (
        SELECT 1 FROM inventory i WHERE i.product_id = p.id
      )
    `);

    console.log('✅ Migrated min_stock_level values from inventory to products');

    // Update all inventory records to use the product's min_stock_level
    await db.query(`
      UPDATE inventory i
      SET min_stock_level = (
        SELECT p.min_stock_level 
        FROM products p 
        WHERE p.id = i.product_id
      )
    `);

    console.log('✅ Synchronized min_stock_level across all inventory records');

    console.log('✅ Migration complete!');
    console.log('\n💡 Now min_stock_level is managed at the product level.');
    console.log('   When you update it, it applies to all branches.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

migrateProductMinStock();
