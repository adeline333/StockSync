const db = require('./db');

(async () => {
  try {
    console.log('🖼️  Checking product images...\n');
    
    const products = await db.query(`
      SELECT id, name, sku, image_url, price
      FROM products
      WHERE name LIKE '%Nozeco%' OR name LIKE '%No Limit%'
      ORDER BY name
    `);
    
    console.log('Products with images:');
    products.rows.forEach(p => {
      console.log(`\nProduct: ${p.name}`);
      console.log(`SKU: ${p.sku}`);
      console.log(`Image URL: ${p.image_url || '❌ NO IMAGE'}`);
      console.log(`Price: ${p.price}`);
    });
    
    // Check if uploads directory exists
    const fs = require('fs');
    const path = require('path');
    const uploadsDir = path.join(__dirname, 'uploads');
    
    console.log('\n\n📁 Checking uploads directory...');
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      console.log(`Found ${files.length} files in uploads:`);
      files.forEach(f => console.log(`  - ${f}`));
    } else {
      console.log('❌ Uploads directory does not exist!');
    }
    
    process.exit(0);
  } catch (e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
})();
