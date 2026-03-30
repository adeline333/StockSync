const fs = require('fs');
const path = require('path');
const db = require('./db');

async function setupDatabase() {
  try {
    console.log('Starting database setup...');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'database.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Execute the SQL schema
    await db.query(sql);
    console.log('Database schema created successfully!');
    
  } catch (error) {
    console.error('Error setting up database:');
    console.error(error);
  } finally {
    // Determine whether to close the pool or just exit
    // In this script we just want to run once and exit
    process.exit(0);
  }
}

setupDatabase();
