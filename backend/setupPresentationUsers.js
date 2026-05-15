require('dotenv').config();
const db = require('./db');
const bcrypt = require('bcrypt');

async function setup() {
  try {
    console.log('--- Starting Presentation User Setup ---');

    // 1. Fix Branches
    console.log('Fixing branches...');
    await db.query(`UPDATE branches SET name = 'Kimironko Branch' WHERE id = 2`);
    await db.query(`UPDATE branches SET name = 'Remera Branch' WHERE id = 3`);
    
    // Ensure we have branch names correctly
    const branches = await db.query('SELECT id, name FROM branches WHERE id IN (2, 3)');
    const kimId = 2;
    const remId = 3;

    const salt = await bcrypt.genSalt(10);
    const commonPassword = await bcrypt.hash('password123', salt);

    // 2. Define our target users
    const users = [
      {
        email: 'adelinetuyizere333@gmail.com',
        name: 'Adeline Admin',
        role: 'admin',
        branch_id: null
      },
      {
        email: 'manager.kimironko@stocksync.com',
        name: 'Magda Kimironko Manager',
        role: 'manager',
        branch_id: kimId
      },
      {
        email: 'staff.kimironko@stocksync.com',
        name: 'Kimironko Cashier',
        role: 'staff',
        branch_id: kimId
      },
      {
        email: 'manager.remera@stocksync.com',
        name: 'Remera Manager',
        role: 'manager',
        branch_id: remId
      },
      {
        email: 'staff.remera@stocksync.com',
        name: 'Rosette Remera Cashier',
        role: 'staff',
        branch_id: remId
      }
    ];

    for (const u of users) {
      // Check for current email or old email to avoid duplicates when changing emails
      let oldEmail = u.email;
      if (u.name === 'Magda Kimironko Manager') oldEmail = 'adelinetuyizere5@gmail.com';
      if (u.name === 'Rosette Remera Cashier') oldEmail = 'uwinezaa31@gmail.com';

      const check = await db.query('SELECT id FROM users WHERE email = $1 OR email = $2', [u.email, oldEmail]);
      
      if (check.rows.length > 0) {
        // Update existing
        await db.query(
          'UPDATE users SET name = $1, role = $2, branch_id = $3, password = $4, email = $5 WHERE id = $6',
          [u.name, u.role, u.branch_id, commonPassword, u.email, check.rows[0].id]
        );
        console.log(`Updated: ${u.name} (${u.email})`);
      } else {
        // Create new
        await db.query(
          'INSERT INTO users (name, email, password, role, branch_id) VALUES ($1, $2, $3, $4, $5)',
          [u.name, u.email, commonPassword, u.role, u.branch_id]
        );
        console.log(`Created: ${u.name} (${u.email})`);
      }
    }

    console.log('--- Setup Complete! ---');
    console.log('All passwords are: password123');
    process.exit(0);
  } catch (e) {
    console.error('Setup failed:', e);
    process.exit(1);
  }
}

setup();
