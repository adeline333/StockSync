const db = require('./db');
const { getWarehouseDashboard } = require('./controllers/dashboardController');

async function test() {
  try {
    console.log('--- TESTING WAREHOUSE DASHBOARD ENDPOINT DIRECTLY ---');

    const req = {
      user: { name: 'Remera Manager', role: 'manager', branch_id: 3 }
    };

    const res = {
      statusCode: 200,
      json: function(data) {
        console.log('Status Code:', this.statusCode);
        console.log('Response Keys:', Object.keys(data));
        console.log('Total Stock:', data.total_stock);
        console.log('Inbound Pending:', data.inbound_pending);
        console.log('Critical Stock:', data.critical_stock);
        console.log('Recent Movements count:', data.recent_movements ? data.recent_movements.length : 0);
        console.log('Recent Movements:', JSON.stringify(data.recent_movements, null, 2));
        console.log('Weekly Movements count:', data.weekly_movements ? data.weekly_movements.length : 0);
        console.log('Weekly Movements:', JSON.stringify(data.weekly_movements, null, 2));
      }
    };

    await getWarehouseDashboard(req, res);
    process.exit(0);
  } catch (e) {
    console.error('Test crashed:', e);
    process.exit(1);
  }
}

test();
