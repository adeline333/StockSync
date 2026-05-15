require('dotenv').config();
const db = require('./db');

// Role-appropriate names for presentation
// Format: { role, name, email }
// The email stays the same so login credentials don't change — only display name updates.
const roleNames = {
  admin:   'Admin User',
  manager: 'Branch Manager',
  staff:   'Sales Staff',
  auditor: 'Auditor',
};

async function updateUserNames() {
  try {
    // 1. Show current state
    const before = await db.query(
      `SELECT u.id, u.name, u.email, u.role, b.name AS branch_name
       FROM users u
       LEFT JOIN branches b ON u.branch_id = b.id
       ORDER BY u.role, u.id`
    );

    console.log('\n📋 CURRENT USERS (before update):');
    console.log('─'.repeat(70));
    before.rows.forEach(u => {
      console.log(`  ID: ${u.id} | Name: "${u.name}" | Role: ${u.role} | Branch: ${u.branch_name || 'None'}`);
    });

    // 2. Update names to match roles
    console.log('\n✏️  Updating names to match roles...\n');

    // Track role counters so if there are multiple staff/managers they get numbered
    const roleCount = {};

    for (const user of before.rows) {
      roleCount[user.role] = (roleCount[user.role] || 0) + 1;
      const count = roleCount[user.role];

      let newName;
      if (user.email === 'adelinetuyizere333@gmail.com') {
        newName = 'Adeline Admin';
      } else if (user.email === 'adelinetuyizere5@gmail.com') {
        newName = 'Magda Kimironko Manager';
      } else if (user.email === 'uwinezaa31@gmail.com') {
        newName = 'Rosette Remera Cashier';
      } else {
        // Fallback for any other users
        if (user.role === 'admin') {
          newName = `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Admin`;
        } else if (user.role === 'manager') {
          newName = `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Manager`;
        } else {
          newName = `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Staff`;
        }
      }

      await db.query('UPDATE users SET name = $1 WHERE id = $2', [newName, user.id]);
      console.log(`  ✅ ID ${user.id}: "${user.name}" → "${newName}"`);
    }

    // 3. Show updated state
    const after = await db.query(
      `SELECT u.id, u.name, u.email, u.role, b.name AS branch_name
       FROM users u
       LEFT JOIN branches b ON u.branch_id = b.id
       ORDER BY u.role, u.id`
    );

    console.log('\n🎉 UPDATED USERS (after update):');
    console.log('─'.repeat(70));
    after.rows.forEach(u => {
      console.log(`  ID: ${u.id} | Name: "${u.name}" | Role: ${u.role} | Email: ${u.email}`);
    });

    console.log('\n✨ Done! Names now match roles. Login credentials are unchanged.\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

updateUserNames();
