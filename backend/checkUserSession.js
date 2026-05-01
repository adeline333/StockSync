const db = require('./db');
const jwt = require('jsonwebtoken');

async function checkUserSession() {
  try {
    // Get all manager users
    const managers = await db.query('SELECT * FROM users WHERE role = $1', ['manager']);
    console.log('📋 Manager users in database:');
    managers.rows.forEach(u => console.log(`   ${u.name} - Branch ID: ${u.branch_id} - Email: ${u.email}`));
    
    // Check if there are any active JWT tokens we can decode
    console.log('\n🔑 JWT Secret from .env:', process.env.JWT_SECRET ? 'Present' : 'Missing');
    
    // Test creating a fresh token for Magda
    const magda = managers.rows.find(u => u.name === 'Magda');
    if (magda) {
      const freshToken = jwt.sign(
        { 
          id: magda.id, 
          email: magda.email, 
          role: magda.role, 
          branch_id: magda.branch_id 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      console.log('\n🆕 Fresh token for Magda (first 50 chars):', freshToken.substring(0, 50) + '...');
      
      // Decode it to verify
      const decoded = jwt.verify(freshToken, process.env.JWT_SECRET);
      console.log('🔍 Decoded token data:', {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        branch_id: decoded.branch_id
      });
    }
    
    process.exit(0);
  } catch (e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
}

checkUserSession();