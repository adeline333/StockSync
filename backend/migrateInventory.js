const db = require('./db');

async function migrate() {
  try {
    // Expand products table
    await db.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS barcode VARCHAR(100)`);
    await db.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS brand VARCHAR(100)`);
    await db.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS cost_price DECIMAL(10,2) DEFAULT 0`);
    await db.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS supplier_name VARCHAR(255)`);
    await db.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS supplier_lead_days INTEGER DEFAULT 0`);
    await db.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT`);
    await db.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS is_vat_inclusive BOOLEAN DEFAULT TRUE`);
    await db.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active'`);

    // Batches table
    await db.query(`CREATE TABLE IF NOT EXISTS batches (
      id SERIAL PRIMARY KEY,
      product_id INTEGER NOT NULL,
      branch_id INTEGER NOT NULL,
      batch_number VARCHAR(100) NOT NULL,
      quantity INTEGER DEFAULT 0,
      expiry_date DATE,
      received_date DATE DEFAULT CURRENT_DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE
    )`);

    // Serial numbers for high-value items
    await db.query(`CREATE TABLE IF NOT EXISTS serial_numbers (
      id SERIAL PRIMARY KEY,
      product_id INTEGER NOT NULL,
      branch_id INTEGER NOT NULL,
      serial_number VARCHAR(255) UNIQUE NOT NULL,
      status VARCHAR(50) DEFAULT 'in_stock',
      sold_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE
    )`);

    // Stock adjustments log
    await db.query(`CREATE TABLE IF NOT EXISTS stock_adjustments (
      id SERIAL PRIMARY KEY,
      product_id INTEGER NOT NULL,
      branch_id INTEGER NOT NULL,
      user_id INTEGER,
      adjustment_type VARCHAR(50) NOT NULL,
      quantity_change INTEGER NOT NULL,
      reason TEXT,
      reference VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )`);

    console.log('✅ Inventory migration complete');
    process.exit(0);
  } catch (e) {
    console.error('Migration failed:', e.message);
    process.exit(1);
  }
}

migrate();
