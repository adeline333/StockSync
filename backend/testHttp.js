const jwt = require('jsonwebtoken');
require('dotenv').config();

async function testHttp() {
  try {
    console.log('--- GENERATING PRESENTATION TOKEN FOR KIMIRONKO MANAGER ---');
    // Generate valid token like the auth controller does
    const payload = { id: 2, role: 'manager', branch_id: 2 };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'supersecret_fallback', { expiresIn: '7d' });
    console.log('Token:', token);

    console.log('\n--- MAKING HTTP REQUEST TO /api/analytics/stockout-risk?branch_id=2 ---');
    const response = await fetch('http://localhost:5000/api/analytics/stockout-risk?branch_id=2', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('HTTP Status:', response.status);
    const data = await response.json();
    console.log('Response JSON:', JSON.stringify(data, null, 2));

    console.log('\n--- MAKING HTTP REQUEST TO /api/analytics/reorder?branch_id=2 ---');
    const response2 = await fetch('http://localhost:5000/api/analytics/reorder?branch_id=2', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('HTTP Status 2:', response2.status);
    const data2 = await response2.json();
    console.log('Response 2 JSON:', JSON.stringify(data2, null, 2));

    process.exit(0);
  } catch (e) {
    console.error('HTTP Test failed:', e);
    process.exit(1);
  }
}

testHttp();
