const db = require('./db');

async function migrate() {
  try {
    console.log('Starting migration to add received_quantity to stock_transfer_items...');
    await db.query(`
      ALTER TABLE stock_transfer_items 
      ADD COLUMN IF NOT EXISTS received_quantity INTEGER DEFAULT NULL
    `);
    console.log('✅ Column received_quantity added to stock_transfer_items table successfully!');
    process.exit(0);
  } catch (e) {
    console.error('❌ Migration failed:', e.message);
    process.exit(1);
  }
}

migrate();
