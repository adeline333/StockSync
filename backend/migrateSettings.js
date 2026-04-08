const db = require('./db');

async function migrate() {
  try {
    await db.query(`CREATE TABLE IF NOT EXISTS system_settings (
      id INTEGER PRIMARY KEY DEFAULT 1,
      company_name VARCHAR(255) DEFAULT 'B SPECIAL BUSINESS LTD',
      support_phone VARCHAR(50) DEFAULT '+250 788 123 456',
      address TEXT DEFAULT 'Prime Economic Zone, Kigali, Rwanda',
      timezone VARCHAR(100) DEFAULT 'Africa/Kigali',
      currency VARCHAR(10) DEFAULT 'RWF',
      vat_rate DECIMAL(5,2) DEFAULT 18,
      prices_tax_inclusive BOOLEAN DEFAULT TRUE,
      last_backup TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    await db.query(`INSERT INTO system_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING`);

    console.log('Settings migration complete');
    process.exit(0);
  } catch (e) {
    console.error('Migration failed:', e.message);
    process.exit(1);
  }
}

migrate();
