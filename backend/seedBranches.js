require('dotenv').config();
const db = require('./db');

const branches = [
  {
    name: 'Central Warehouse',
    location: 'Kigali Industrial Zone, KG 9 Ave',
    contact: '+250 788 123 456'
  },
  {
    name: 'Retail Branch A - Kimironko',
    location: 'Kimironko Market, KN 5 Rd',
    contact: '+250 788 234 567'
  },
  {
    name: 'Retail Branch B - Remera',
    location: 'Remera Shopping Center, KG 11 Ave',
    contact: '+250 788 345 678'
  },
  {
    name: 'Retail Branch C - Nyabugogo',
    location: 'Nyabugogo Commercial Complex',
    contact: '+250 788 456 789'
  }
];

async function seedBranches() {
  try {
    console.log('🌱 Seeding branches...');

    // Check if branches already exist
    const existing = await db.query('SELECT COUNT(*) as count FROM branches');
    const count = parseInt(existing.rows[0].count);

    if (count > 0) {
      console.log(`ℹ️  Found ${count} existing branch(es). Skipping seed.`);
      console.log('💡 To re-seed, first run: DELETE FROM branches;');
      process.exit(0);
    }

    // Insert branches
    for (const branch of branches) {
      await db.query(
        'INSERT INTO branches (name, location, contact) VALUES ($1, $2, $3)',
        [branch.name, branch.location, branch.contact]
      );
      console.log(`✅ Created: ${branch.name}`);
    }

    // Show all branches
    const result = await db.query('SELECT * FROM branches ORDER BY id');
    console.log('\n📍 All Branches:');
    console.log('─'.repeat(80));
    result.rows.forEach(b => {
      console.log(`ID: ${b.id} | ${b.name}`);
      console.log(`   📍 ${b.location}`);
      console.log(`   📞 ${b.contact}`);
      console.log('─'.repeat(80));
    });

    console.log('\n✨ Branch seeding complete!');
    console.log('\n💡 Next steps:');
    console.log('   1. Register users and assign them to branches');
    console.log('   2. Add products (they will auto-initialize inventory for all branches)');
    console.log('   3. Adjust stock levels per branch\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedBranches();
