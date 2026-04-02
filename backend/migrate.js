const db = require('./db');

async function migrate() {
  try {
    await db.query(`CREATE TABLE IF NOT EXISTS login_attempts (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      ip_address VARCHAR(100),
      success BOOLEAN DEFAULT FALSE,
      attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    await db.query(`CREATE TABLE IF NOT EXISTS activity_logs (
      id SERIAL PRIMARY KEY,
      user_id INTEGER,
      action VARCHAR(255) NOT NULL,
      details TEXT,
      ip_address VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )`);

    await db.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS failed_attempts INTEGER DEFAULT 0`);
    await db.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP DEFAULT NULL`);
    await db.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP DEFAULT NULL`);

    console.log('✅ Migration complete');
    process.exit(0);
  } catch (e) {
    console.error('Migration failed:', e.message);
    process.exit(1);
  }
}

migrate();
