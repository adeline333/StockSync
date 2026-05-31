const db = require('./db');
const { getStockOutRisk } = require('./controllers/analyticsController');

async function testEndpoint() {
  try {
    console.log('--- TESTING CONTROLLER DIRECTLY FOR KIMIRONKO (branch_id=2) ---');

    // Simulate Express request and response
    const req = {
      query: { branch_id: '2' },
      user: { id: 2, role: 'manager', branch_id: 2 }
    };

    const res = {
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        console.log('StatusCode:', this.statusCode || 200);
        console.log('Response Items Count:', data.items ? data.items.length : 0);
        console.log('Response Total At Risk:', data.total_at_risk);
        console.log('Response Items:', JSON.stringify(data.items, null, 2));
      }
    };

    await getStockOutRisk(req, res);
    process.exit(0);
  } catch (e) {
    console.error('Error running testEndpoint:', e);
    process.exit(1);
  }
}

testEndpoint();
