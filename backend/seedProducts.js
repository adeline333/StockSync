const db = require('./db');

const products = [
  {
    name: 'Freixenet Sparkling Wine',
    sku: 'WIN-FREIX-750',
    description: 'Classic Spanish cava sparkling wine, 750ml',
    price: 12000,
    cost_price: 8500,
    category: 'Wines',
    brand: 'Freixenet',
    image_url: '/imgs/freixenet.jpg',
    supplier_name: 'Wine Imports Ltd',
    supplier_lead_days: 7,
    is_vat_inclusive: true,
  },
  {
    name: 'No Limit Whisky',
    sku: 'SPI-NOLIM-750',
    description: 'Smooth blended whisky, 750ml',
    price: 9500,
    cost_price: 6500,
    category: 'Spirits',
    brand: 'No Limit',
    image_url: '/imgs/no limit.webp',
    supplier_name: 'Spirits Distributors RW',
    supplier_lead_days: 5,
    is_vat_inclusive: true,
  },
  {
    name: "Norah's Valley Red Wine",
    sku: 'WIN-NORAH-750',
    description: "Norah's Valley premium red wine, 750ml",
    price: 11000,
    cost_price: 7800,
    category: 'Wines',
    brand: "Norah's Valley",
    image_url: '/imgs/norahs valley.jpg',
    supplier_name: 'Wine Imports Ltd',
    supplier_lead_days: 7,
    is_vat_inclusive: true,
  },
  {
    name: 'Nozeco Sparkling Wine',
    sku: 'WIN-NOZEC-750',
    description: 'Light and refreshing sparkling wine, 750ml',
    price: 8500,
    cost_price: 5500,
    category: 'Wines',
    brand: 'Nozeco',
    image_url: '/imgs/nozeco sparkling wine.webp',
    supplier_name: 'Wine Imports Ltd',
    supplier_lead_days: 7,
    is_vat_inclusive: true,
  },
  {
    name: 'Nozeco Spumante Rosé',
    sku: 'WIN-NOZRO-750',
    description: 'Italian-style rosé spumante, 750ml',
    price: 9000,
    cost_price: 6000,
    category: 'Wines',
    brand: 'Nozeco',
    image_url: '/imgs/nozeco spumante rose.jpg',
    supplier_name: 'Wine Imports Ltd',
    supplier_lead_days: 7,
    is_vat_inclusive: true,
  },
  {
    name: 'Dry Pink Rosé Wine',
    sku: 'WIN-DRYPK-750',
    description: 'Crisp and dry rosé wine, 750ml',
    price: 10000,
    cost_price: 7000,
    category: 'Wines',
    brand: 'Dry Pink',
    image_url: '/imgs/dry pink.png',
    supplier_name: 'Wine Imports Ltd',
    supplier_lead_days: 7,
    is_vat_inclusive: true,
  },
];

async function seed() {
  try {
    // Get all branches to initialize inventory
    const branches = await db.query('SELECT id FROM branches');

    for (const p of products) {
      // Upsert product
      const result = await db.query(
        `INSERT INTO products (name, sku, description, price, cost_price, category, brand, image_url,
          supplier_name, supplier_lead_days, is_vat_inclusive, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'active')
         ON CONFLICT (sku) DO UPDATE SET
           name = EXCLUDED.name, price = EXCLUDED.price, cost_price = EXCLUDED.cost_price,
           image_url = EXCLUDED.image_url, updated_at = NOW()
         RETURNING id, name`,
        [p.name, p.sku, p.description, p.price, p.cost_price, p.category,
         p.brand, p.image_url, p.supplier_name, p.supplier_lead_days, p.is_vat_inclusive]
      );

      const product = result.rows[0];

      // Initialize inventory for each branch with 50 units
      for (const branch of branches.rows) {
        await db.query(
          `INSERT INTO inventory (product_id, branch_id, quantity, min_stock_level)
           VALUES ($1, $2, 50, 10)
           ON CONFLICT (product_id, branch_id) DO NOTHING`,
          [product.id, branch.id]
        );
      }

      console.log(`✅ ${product.name}`);
    }

    console.log('\n🎉 All products seeded successfully!');
    process.exit(0);
  } catch (e) {
    console.error('Seed failed:', e.message);
    process.exit(1);
  }
}

seed();
