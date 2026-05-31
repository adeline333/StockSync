const db = require('./db');

async function check() {
  try {
    console.log('--- RECENT TRANSACTION DATES ---');
    const tx = await db.query('SELECT type, quantity, created_at FROM transactions ORDER BY created_at DESC LIMIT 10');
    console.log('Transactions:');
    tx.rows.forEach(r => console.log(`   ${r.type} - Qty: ${r.quantity} on ${r.created_at.toISOString()}`));

    console.log('\n--- RECENT STOCK ADJUSTMENT DATES ---');
    const sa = await db.query('SELECT adjustment_type, quantity_change, created_at FROM stock_adjustments ORDER BY created_at DESC LIMIT 10');
    console.log('Adjustments:');
    sa.rows.forEach(r => console.log(`   ${r.adjustment_type} - Qty: ${r.quantity_change} on ${r.created_at.toISOString()}`));

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

check();
