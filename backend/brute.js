const { Pool } = require('pg');
const users = ['postgres', process.env.USERNAME, 'root', 'admin'];
const passwords = ['YOUR_POSTGRES_PASSWORD_HERE', '', 'postgres', 'root', 'password', 'admin', '123456'];

async function tryConnect() {
  for (let user of users) {
    if (!user) continue;
    for (let password of passwords) {
      const pool = new Pool({
        user,
        host: 'localhost',
        database: 'postgres', // default DB that always exists
        password,
        port: 5432,
      });

      try {
        const client = await pool.connect();
        console.log(`SUCCESS: user=${user}, password=${password}`);
        client.release();
        process.exit(0);
      } catch (e) {
        // console.log(`FAILED: user=${user}, password=${password}`);
      } finally {
        await pool.end();
      }
    }
  }
  console.log('ALL FAILED');
}
tryConnect();
