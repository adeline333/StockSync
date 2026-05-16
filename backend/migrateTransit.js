const db = require('./db');

async function migrate() {
  try {
    console.log('Starting transit migration...');
    
    // Add new columns to stock_transfers
    await db.query(`ALTER TABLE stock_transfers ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMP DEFAULT NULL`);
    await db.query(`ALTER TABLE stock_transfers ADD COLUMN IF NOT EXISTS received_at TIMESTAMP DEFAULT NULL`);
    await db.query(`ALTER TABLE stock_transfers ADD COLUMN IF NOT EXISTS received_by INTEGER REFERENCES users(id) ON DELETE SET NULL`);
    
    console.log('✅ Transit migration complete');
    process.exit(0);
  } catch (e) {
    console.error('Migration failed:', e.message);
    process.exit(1);
  }
}

migrate();
