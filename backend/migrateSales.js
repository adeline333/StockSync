const db = require('./db');

async function migrate() {
  try {
    await db.query(`CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      order_number VARCHAR(50) UNIQUE NOT NULL,
      branch_id INTEGER,
      customer_id INTEGER,
      user_id INTEGER,
      subtotal DECIMAL(12,2) DEFAULT 0,
      discount_amount DECIMAL(12,2) DEFAULT 0,
      vat_amount DECIMAL(12,2) DEFAULT 0,
      total_amount DECIMAL(12,2) DEFAULT 0,
      payment_method VARCHAR(50) DEFAULT 'cash',
      amount_tendered DECIMAL(12,2) DEFAULT 0,
      change_amount DECIMAL(12,2) DEFAULT 0,
      notes TEXT,
      status VARCHAR(50) DEFAULT 'completed',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )`);

    await db.query(`CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER NOT NULL,
      product_id INTEGER,
      product_name VARCHAR(255),
      product_sku VARCHAR(100),
      quantity INTEGER NOT NULL,
      unit_price DECIMAL(12,2) NOT NULL,
      total_price DECIMAL(12,2) NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
    )`);

    await db.query(`CREATE TABLE IF NOT EXISTS customers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      email VARCHAR(255),
      tin VARCHAR(50),
      tin_verified BOOLEAN DEFAULT FALSE,
      address TEXT,
      customer_type VARCHAR(50) DEFAULT 'retail',
      credit_limit DECIMAL(12,2) DEFAULT 0,
      credit_used DECIMAL(12,2) DEFAULT 0,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    console.log('✅ Sales migration complete');
    process.exit(0);
  } catch (e) {
    console.error('Migration failed:', e.message);
    process.exit(1);
  }
}

migrate();
