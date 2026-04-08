const db = require('./db');

async function migrate() {
  try {
    await db.query(`CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      user_id INTEGER,
      title VARCHAR(255) NOT NULL,
      message TEXT,
      category VARCHAR(50) DEFAULT 'system',
      severity VARCHAR(50) DEFAULT 'info',
      is_read BOOLEAN DEFAULT FALSE,
      action_url VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    await db.query(`CREATE TABLE IF NOT EXISTS notification_preferences (
      id SERIAL PRIMARY KEY,
      user_id INTEGER UNIQUE NOT NULL,
      stock_alerts BOOLEAN DEFAULT TRUE,
      transfer_requests BOOLEAN DEFAULT TRUE,
      sales_reports BOOLEAN DEFAULT FALSE,
      reconciliation_alerts BOOLEAN DEFAULT TRUE,
      email_enabled BOOLEAN DEFAULT TRUE,
      sms_enabled BOOLEAN DEFAULT FALSE,
      alert_email VARCHAR(255),
      alert_phone VARCHAR(50),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    console.log('✅ Notifications migration complete');
    process.exit(0);
  } catch (e) {
    console.error('Migration failed:', e.message);
    process.exit(1);
  }
}

migrate();
