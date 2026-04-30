require('dotenv').config();
const db = require('./db');

async function migrateBranches() {
  try {
    console.log('🔄 Running branches migration...');

    // Add is_active column if it doesn't exist
    await db.query(`
      ALTER TABLE branches 
      ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE
    `);

    console.log('✅ Added is_active column to branches table');

    // Update existing branches to be active
    await db.query('UPDATE branches SET is_active = TRUE WHERE is_active IS NULL');
    console.log('✅ Set all existing branches to active');

    console.log('✅ Branches migration complete');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
}

migrateBranches();
