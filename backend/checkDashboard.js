const db = require('./db');

(async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const branch_id = 2; // Rosette's branch (Kimironko)
    
    console.log('Testing retail dashboard query for branch_id:', branch_id);
    console.log('Today:', today);

    // This is exactly what the dashboard controller does
    const bf = branch_id ? `AND o.branch_id = ${parseInt(branch_id)}` : '';
    
    const result = await db.query(
      `SELECT COALESCE(SUM(total_amount), 0) as revenue, COUNT(*) as count,
        COALESCE(SUM(CASE WHEN payment_method = 'cash' THEN amount_tendered - total_amount ELSE 0 END), 0) as cash_in_drawer
       FROM orders WHERE status = 'completed' AND DATE(created_at) = $1 ${bf}`,
      [today]
    );
    
    console.log('\n✅ Dashboard query result:', result.rows[0]);
    
    // Also check the raw orders
    const raw = await db.query(
      `SELECT id, order_number, total_amount, status, branch_id, DATE(created_at) as date
       FROM orders WHERE branch_id = $1`,
      [branch_id]
    );
    console.log('\n📋 All orders for branch 2:', raw.rows);

    // Check timezone issue
    const tzCheck = await db.query(
      `SELECT id, order_number, created_at, created_at AT TIME ZONE 'Africa/Kigali' as kigali_time,
       DATE(created_at) as utc_date,
       DATE(created_at AT TIME ZONE 'Africa/Kigali') as kigali_date
       FROM orders WHERE branch_id = $1`,
      [branch_id]
    );
    console.log('\n🕐 Timezone check:');
    tzCheck.rows.forEach(r => {
      console.log(`  Order: ${r.order_number}`);
      console.log(`  UTC date: ${r.utc_date}`);
      console.log(`  Kigali date: ${r.kigali_date}`);
      console.log(`  Today (server): ${today}`);
      console.log(`  Match: ${r.utc_date === today ? '✅ YES' : '❌ NO'}`);
    });

    process.exit(0);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
})();
