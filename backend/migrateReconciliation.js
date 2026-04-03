const db = require('./db');

async function migrate() {
  try {
    await db.query(`CREATE TABLE IF NOT EXISTS reconciliations (
      id SERIAL PRIMARY KEY,
      branch_id INTEGER,
      period_start DATE NOT NULL,
      period_end DATE NOT NULL,
      total_items INTEGER DEFAULT 0,
      matched_items INTEGER DEFAULT 0,
      mismatched_items INTEGER DEFAULT 0,
      variance_value DECIMAL(12,2) DEFAULT 0,
      score DECIMAL(5,2) DEFAULT 0,
      status VARCHAR(50) DEFAULT 'pending',
      run_by INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
      FOREIGN KEY (run_by) REFERENCES users(id) ON DELETE SET NULL
    )`);

    await db.query(`CREATE TABLE IF NOT EXISTS reconciliation_items (
      id SERIAL PRIMARY KEY,
      reconciliation_id INTEGER NOT NULL,
      product_id INTEGER,
      product_name VARCHAR(255),
      product_sku VARCHAR(100),
      sales_qty INTEGER DEFAULT 0,
      stock_deducted INTEGER DEFAULT 0,
      variance INTEGER DEFAULT 0,
      status VARCHAR(50) DEFAULT 'matched',
      resolution VARCHAR(50),
      resolution_notes TEXT,
      resolved_by INTEGER,
      resolved_at TIMESTAMP,
      FOREIGN KEY (reconciliation_id) REFERENCES reconciliations(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
      FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL
    )`);

    console.log('✅ Reconciliation migration complete');
    process.exit(0);
  } catch (e) {
    console.error('Migration failed:', e.message);
    process.exit(1);
  }
}

migrate();
