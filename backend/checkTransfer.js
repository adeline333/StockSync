const db = require('./db');

(async () => {
  try {
    console.log('🔍 Checking recent transfers...\n');
    
    // Check recent transfers
    const transfers = await db.query(`
      SELECT st.*, 
        sb.name as source_name, 
        db.name as dest_name,
        u.name as requested_by_name,
        a.name as approved_by_name
      FROM stock_transfers st
      LEFT JOIN branches sb ON st.source_branch_id = sb.id
      LEFT JOIN branches db ON st.dest_branch_id = db.id
      LEFT JOIN users u ON st.requested_by = u.id
      LEFT JOIN users a ON st.approved_by = a.id
      ORDER BY st.created_at DESC LIMIT 3
    `);
    
    console.log('📋 Recent Transfers:');
    transfers.rows.forEach(t => {
      console.log(`\n  Transfer: ${t.transfer_number}`);
      console.log(`  Status: ${t.status}`);
      console.log(`  From: ${t.source_name} (ID: ${t.source_branch_id})`);
      console.log(`  To: ${t.dest_name} (ID: ${t.dest_branch_id})`);
      console.log(`  Requested by: ${t.requested_by_name}`);
      console.log(`  Approved by: ${t.approved_by_name || 'N/A'}`);
      console.log(`  Created: ${t.created_at}`);
    });
    
    if (transfers.rows.length > 0) {
      const latestTransfer = transfers.rows[0];
      
      // Check transfer items
      console.log('\n\n📦 Transfer Items:');
      const items = await db.query(`
        SELECT sti.*, p.name as product_name, p.sku
        FROM stock_transfer_items sti
        JOIN products p ON sti.product_id = p.id
        WHERE sti.transfer_id = $1
      `, [latestTransfer.id]);
      
      items.rows.forEach(item => {
        console.log(`  - ${item.product_name} (${item.sku}): ${item.quantity} units`);
      });
      
      // Check inventory at destination
      console.log(`\n\n📊 Inventory at ${latestTransfer.dest_name}:`);
      const destInv = await db.query(`
        SELECT p.name, p.sku, i.quantity, i.last_updated
        FROM inventory i
        JOIN products p ON i.product_id = p.id
        WHERE i.branch_id = $1
        ORDER BY p.name
      `, [latestTransfer.dest_branch_id]);
      
      if (destInv.rows.length === 0) {
        console.log('  ⚠️  No inventory found at destination branch!');
      } else {
        destInv.rows.forEach(inv => {
          console.log(`  - ${inv.name} (${inv.sku}): ${inv.quantity} units (Updated: ${inv.last_updated})`);
        });
      }
      
      // Check inventory at source
      console.log(`\n\n📊 Inventory at ${latestTransfer.source_name}:`);
      const sourceInv = await db.query(`
        SELECT p.name, p.sku, i.quantity, i.last_updated
        FROM inventory i
        JOIN products p ON i.product_id = p.id
        WHERE i.branch_id = $1
        ORDER BY p.name
      `, [latestTransfer.source_branch_id]);
      
      sourceInv.rows.forEach(inv => {
        console.log(`  - ${inv.name} (${inv.sku}): ${inv.quantity} units (Updated: ${inv.last_updated})`);
      });
    }
    
    process.exit(0);
  } catch (e) {
    console.error('❌ Error:', e.message);
    console.error(e.stack);
    process.exit(1);
  }
})();
