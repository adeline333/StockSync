const db = require('./db');

(async () => {
  try {
    console.log('🔍 Locating transfer TR-2026-026181...');
    
    // Find the transfer
    const res = await db.query("SELECT * FROM stock_transfers WHERE transfer_number = 'TR-2026-026181'");
    if (res.rows.length === 0) {
      console.log('❌ Transfer TR-2026-026181 not found in the database.');
      process.exit(1);
    }
    
    const transfer = res.rows[0];
    console.log(`Found transfer ID: ${transfer.id}. Status: ${transfer.status}.`);
    
    if (transfer.status !== 'pending') {
      console.log(`⚠️ Warning: Transfer is already in status '${transfer.status}', but deleting anyway as requested.`);
    }

    // 1. Delete items first to satisfy foreign key constraints
    console.log('🗑️ Deleting transfer items...');
    await db.query('DELETE FROM stock_transfer_items WHERE transfer_id = $1', [transfer.id]);
    
    // 2. Delete transfer
    console.log('🗑️ Deleting main transfer record...');
    await db.query('DELETE FROM stock_transfers WHERE id = $1', [transfer.id]);
    
    console.log('🎉 Transfer TR-2026-026181 deleted successfully!');
    process.exit(0);
  } catch (e) {
    console.error('❌ Error during deletion:', e.message);
    process.exit(1);
  }
})();
