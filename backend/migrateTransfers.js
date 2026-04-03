const db = require('./db');

async function migrate() {
  try {
    await db.query(`CREATE TABLE IF NOT EXISTS stock_transfers (
      id SERIAL PRIMARY KEY,
      transfer_number VARCHAR(50) UNIQUE NOT NULL,
      source_branch_id INTEGER NOT NULL,
      dest_branch_id INTEGER NOT NULL,
      requested_by INTEGER,
      approved_by INTEGER,
      status VARCHAR(50) DEFAULT 'pending',
      priority VARCHAR(50) DEFAULT 'normal',
      reason TEXT,
      notes TEXT,
      rejected_reason TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (source_branch_id) REFERENCES branches(id) ON DELETE CASCADE,
      FOREIGN KEY (dest_branch_id) REFERENCES branches(id) ON DELETE CASCADE,
      FOREIGN KEY (requested_by) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
    )`);

    await db.query(`CREATE TABLE IF NOT EXISTS stock_transfer_items (
      id SERIAL PRIMARY KEY,
      transfer_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      FOREIGN KEY (transfer_id) REFERENCES stock_transfers(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )`);

    // Add lat/lng to branches for geolocation
    await db.query(`ALTER TABLE branches ADD COLUMN IF NOT EXISTS latitude DECIMAL(10,8) DEFAULT NULL`);
    await db.query(`ALTER TABLE branches ADD COLUMN IF NOT EXISTS longitude DECIMAL(11,8) DEFAULT NULL`);
    await db.query(`ALTER TABLE branches ADD COLUMN IF NOT EXISTS branch_type VARCHAR(50) DEFAULT 'warehouse'`);
    await db.query(`ALTER TABLE branches ADD COLUMN IF NOT EXISTS manager_name VARCHAR(255) DEFAULT NULL`);
    await db.query(`ALTER TABLE branches ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE`);

    console.log('✅ Transfers migration complete');
    process.exit(0);
  } catch (e) {
    console.error('Migration failed:', e.message);
    process.exit(1);
  }
}

migrate();
