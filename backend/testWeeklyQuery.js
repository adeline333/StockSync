const db = require('./db');

async function testWeeklyQuery() {
  try {
    console.log('--- TESTING NEW TRANSACTIONS-BASED WEEKLY MOVEMENTS QUERY ---');
    const branch_id = 3; // Remera Manager
    const txBranchFilter = branch_id ? `AND (source_branch_id = ${parseInt(branch_id)} OR dest_branch_id = ${parseInt(branch_id)})` : '';
    
    const queryStr = `SELECT DATE(created_at) as date, type, SUM(quantity) as qty
       FROM transactions WHERE created_at >= NOW() - INTERVAL '7 days' ${txBranchFilter}
       GROUP BY DATE(created_at), type ORDER BY date ASC`;
       
    console.log('Executing query for branch 3:', queryStr);
    const res = await db.query(queryStr);
    console.log('Result for branch 3 rows:', res.rows);

    const branch_id_2 = 2; // Kimironko Manager
    const txBranchFilter2 = branch_id_2 ? `AND (source_branch_id = ${parseInt(branch_id_2)} OR dest_branch_id = ${parseInt(branch_id_2)})` : '';
    const queryStr2 = `SELECT DATE(created_at) as date, type, SUM(quantity) as qty
       FROM transactions WHERE created_at >= NOW() - INTERVAL '7 days' ${txBranchFilter2}
       GROUP BY DATE(created_at), type ORDER BY date ASC`;
       
    console.log('\nExecuting query for branch 2:', queryStr2);
    const res2 = await db.query(queryStr2);
    console.log('Result for branch 2 rows:', res2.rows);

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

testWeeklyQuery();
