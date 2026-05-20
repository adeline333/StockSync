const db = require('./db');

async function test() {
  try {
    const start = '2020-01-01';
    const end = '2030-01-01';
    const bf = 'AND o.branch_id = 1';

    const daily = await db.query(
      `SELECT DATE(o.created_at) as date,
        COUNT(*) as transactions,
        COALESCE(SUM(o.total_amount), 0) as revenue,
        COALESCE(SUM(o.vat_amount), 0) as vat,
        COALESCE(SUM(o.discount_amount), 0) as discounts
       FROM orders o
       WHERE o.status = 'completed' AND DATE(o.created_at) BETWEEN $1 AND $2 ${bf}
       GROUP BY DATE(o.created_at) ORDER BY date ASC`,
      [start, end]
    );
    console.log('Daily query success', daily.rows);
  } catch(e) {
    console.error('ERROR:', e.message);
  }
  process.exit(0);
}
test();
