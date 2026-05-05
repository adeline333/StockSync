const db = require('../db');
const multer = require('multer');
const csv = require('csv-parse/sync');
const fs = require('fs');
const path = require('path');

const logActivity = async (user_id, action, details, ip) => {
  try {
    await db.query('INSERT INTO activity_logs (user_id, action, details, ip_address) VALUES ($1,$2,$3,$4)', [user_id, action, details, ip]);
  } catch (e) { console.error('Log error:', e.message); }
};
const getIP = (req) => req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
// ─── PRODUCTS ────────────────────────────────────────────────────────────────

exports.getProducts = async (req, res) => {
  const { search, category, status, page = 1, limit = 20, branch_id } = req.query;
  const offset = (page - 1) * limit;
  let conditions = [];
  let params = [];
  let idx = 1;

  if (search) {
    conditions.push(`(p.name ILIKE $${idx} OR p.sku ILIKE $${idx} OR p.barcode ILIKE $${idx})`);
    params.push(`%${search}%`); idx++;
  }
  if (category && category !== 'all') {
    conditions.push(`p.category = $${idx++}`);
    params.push(category);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  try {
    const branchFilter = branch_id ? `AND i.branch_id = ${parseInt(branch_id)}` : '';

    params.push(parseInt(limit), parseInt(offset));
    const result = await db.query(
      `SELECT p.*, 
        COALESCE(SUM(i.quantity), 0) as total_stock,
        COALESCE(MIN(i.min_stock_level), 10) as min_stock_level
       FROM products p
       LEFT JOIN inventory i ON p.id = i.product_id ${branchFilter}
       ${where}
       GROUP BY p.id
       ORDER BY p.created_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      params
    );

    const countResult = await db.query(
      `SELECT COUNT(*) FROM products p ${where}`, params.slice(0, idx - 1)
    );

    // Apply status filter after aggregation
    let products = result.rows;
    if (status && status !== 'all') {
      products = products.filter(p => {
        const qty = parseInt(p.total_stock);
        if (status === 'in_stock') return qty > p.min_stock_level;
        if (status === 'low_stock') return qty > 0 && qty <= p.min_stock_level;
        if (status === 'out_of_stock') return qty === 0;
        return true;
      });
    }

    res.json({ products, total: parseInt(countResult.rows[0].count), page: parseInt(page), limit: parseInt(limit) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT p.*, 
        COALESCE(SUM(i.quantity), 0) as total_stock
       FROM products p
       LEFT JOIN inventory i ON p.id = i.product_id
       WHERE p.id = $1
       GROUP BY p.id`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Product not found' });

    // Get per-branch stock - include ALL branches, not just those with inventory
    const branchStock = await db.query(
      `SELECT 
        b.id as branch_id,
        b.name as branch_name,
        COALESCE(i.quantity, 0) as quantity,
        COALESCE(i.min_stock_level, p.min_stock_level, 0) as min_stock_level
       FROM branches b
       CROSS JOIN products p
       LEFT JOIN inventory i ON i.branch_id = b.id AND i.product_id = p.id
       WHERE p.id = $1 AND b.is_active = TRUE
       ORDER BY b.id`, 
      [req.params.id]
    );

    // Get batches
    const batches = await db.query(
      `SELECT bt.*, b.name as branch_name FROM batches bt
       JOIN branches b ON bt.branch_id = b.id
       WHERE bt.product_id = $1 ORDER BY bt.expiry_date ASC`, [req.params.id]
    );

    res.json({ product: result.rows[0], branchStock: branchStock.rows, batches: batches.rows });
  } catch (e) {
    console.error('Get product by ID error:', e);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createProduct = async (req, res) => {
  const { name, sku, description, price, cost_price, category, brand, barcode,
    supplier_name, supplier_lead_days, is_vat_inclusive, min_stock_level } = req.body;
  const ip = getIP(req);

  // Handle uploaded image — move to permanent location
  let image_url = null;
  if (req.file) {
    const ext = path.extname(req.file.originalname) || '.jpg';
    const dest = path.join(__dirname, '../uploads', `product_${Date.now()}${ext}`);
    fs.renameSync(req.file.path, dest);
    image_url = `/uploads/product_${Date.now()}${ext}`;
    // Use the actual filename we just moved to
    image_url = `/uploads/${path.basename(dest)}`;
  }

  try {
    const existing = await db.query('SELECT id FROM products WHERE sku = $1', [sku]);
    if (existing.rows.length > 0) return res.status(400).json({ message: 'SKU already exists' });

    const result = await db.query(
      `INSERT INTO products (name, sku, description, price, cost_price, category, brand, barcode,
        supplier_name, supplier_lead_days, is_vat_inclusive, image_url, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'active') RETURNING *`,
      [name, sku, description || null, price, cost_price || 0, category || null, brand || null,
       barcode || null, supplier_name || null, supplier_lead_days || 0, is_vat_inclusive !== false, image_url]
    );

    const product = result.rows[0];

    // Initialize inventory for all branches with 0 stock
    const branches = await db.query('SELECT id FROM branches');
    for (const branch of branches.rows) {
      await db.query(
        `INSERT INTO inventory (product_id, branch_id, quantity, min_stock_level)
         VALUES ($1, $2, 0, $3) ON CONFLICT (product_id, branch_id) DO NOTHING`,
        [product.id, branch.id, min_stock_level || 10]
      );
    }

    await logActivity(req.user.id, 'PRODUCT_CREATED', `Created product: ${name} (${sku})`, ip);
    res.status(201).json({ product });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProduct = async (req, res) => {
  const { name, description, price, cost_price, category, brand, barcode,
    supplier_name, supplier_lead_days, is_vat_inclusive, status } = req.body;
  const ip = getIP(req);

  try {
    const result = await db.query(
      `UPDATE products SET name=$1, description=$2, price=$3, cost_price=$4, category=$5,
        brand=$6, barcode=$7, supplier_name=$8, supplier_lead_days=$9,
        is_vat_inclusive=$10, status=$11, updated_at=NOW()
       WHERE id=$12 RETURNING *`,
      [name, description, price, cost_price, category, brand, barcode,
       supplier_name, supplier_lead_days, is_vat_inclusive, status, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    await logActivity(req.user.id, 'PRODUCT_UPDATED', `Updated product ID: ${req.params.id}`, ip);
    res.json({ product: result.rows[0] });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  const ip = getIP(req);
  try {
    await db.query('DELETE FROM products WHERE id = $1', [req.params.id]);
    await logActivity(req.user.id, 'PRODUCT_DELETED', `Deleted product ID: ${req.params.id}`, ip);
    res.json({ message: 'Product deleted' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── STOCK ADJUSTMENT ────────────────────────────────────────────────────────

exports.adjustStock = async (req, res) => {
  const { product_id, branch_id, quantity_change, adjustment_type, reason, reference } = req.body;
  const ip = getIP(req);
  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    const inv = await client.query(
      'SELECT quantity FROM inventory WHERE product_id=$1 AND branch_id=$2 FOR UPDATE',
      [product_id, branch_id]
    );

    const currentQty = inv.rows.length > 0 ? inv.rows[0].quantity : 0;
    const newQty = currentQty + quantity_change;
    if (newQty < 0) throw new Error('Stock cannot go below zero');

    await client.query(
      `INSERT INTO inventory (product_id, branch_id, quantity)
       VALUES ($1,$2,$3)
       ON CONFLICT (product_id, branch_id)
       DO UPDATE SET quantity = $3, last_updated = NOW()`,
      [product_id, branch_id, newQty]
    );

    await client.query(
      `INSERT INTO stock_adjustments (product_id, branch_id, user_id, adjustment_type, quantity_change, reason, reference)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [product_id, branch_id, req.user.id, adjustment_type, quantity_change, reason, reference]
    );

    // Also log in transactions table
    await client.query(
      `INSERT INTO transactions (product_id, source_branch_id, type, quantity, user_id, status)
       VALUES ($1,$2,$3,$4,$5,'completed')`,
      [product_id, branch_id, adjustment_type || 'adjustment', Math.abs(quantity_change), req.user.id]
    );

    await client.query('COMMIT');
    await logActivity(req.user.id, 'STOCK_ADJUSTED', `${adjustment_type} ${quantity_change > 0 ? '+' : ''}${quantity_change} for product ${product_id}`, ip);
    res.json({ message: 'Stock adjusted', new_quantity: newQty });
  } catch (e) {
    await client.query('ROLLBACK');
    res.status(400).json({ message: e.message });
  } finally {
    client.release();
  }
};

// ─── UPDATE MIN STOCK LEVEL ──────────────────────────────────────────────────

exports.updateMinStock = async (req, res) => {
  const { product_id, min_stock_level } = req.body;
  const ip = getIP(req);

  try {
    console.log('Updating min stock:', { product_id, min_stock_level });
    
    // Update the product's min_stock_level
    const productResult = await db.query(
      `UPDATE products SET min_stock_level = $1 WHERE id = $2 RETURNING *`,
      [min_stock_level, product_id]
    );

    console.log('Product updated:', productResult.rows[0]);

    // Sync to all inventory records for this product
    const inventoryResult = await db.query(
      `UPDATE inventory SET min_stock_level = $1 WHERE product_id = $2 RETURNING *`,
      [min_stock_level, product_id]
    );

    console.log('Inventory records updated:', inventoryResult.rowCount);

    await logActivity(req.user.id, 'MIN_STOCK_UPDATED', `Updated min stock level to ${min_stock_level} for product ${product_id}`, ip);
    res.json({ message: 'Min stock level updated successfully' });
  } catch (e) {
    console.error('Error updating min stock:', e);
    res.status(500).json({ message: 'Server error: ' + e.message });
  }
};

// ─── STOCK MOVEMENTS ─────────────────────────────────────────────────────────

exports.getMovements = async (req, res) => {
  const { from_date, to_date, type, branch_id, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  let conditions = [];
  let params = [];
  let idx = 1;

  if (from_date) { conditions.push(`t.created_at >= $${idx++}`); params.push(from_date); }
  if (to_date) { conditions.push(`t.created_at <= $${idx++}`); params.push(to_date + ' 23:59:59'); }
  if (type && type !== 'all') { conditions.push(`t.type = $${idx++}`); params.push(type); }
  if (branch_id && branch_id !== 'all') {
    conditions.push(`(t.source_branch_id = $${idx} OR t.dest_branch_id = $${idx})`);
    params.push(branch_id); idx++;
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  try {
    params.push(parseInt(limit), parseInt(offset));
    const result = await db.query(
      `SELECT t.*, p.name as product_name, p.sku,
        sb.name as source_branch_name, db.name as dest_branch_name,
        u.name as user_name
       FROM transactions t
       LEFT JOIN products p ON t.product_id = p.id
       LEFT JOIN branches sb ON t.source_branch_id = sb.id
       LEFT JOIN branches db ON t.dest_branch_id = db.id
       LEFT JOIN users u ON t.user_id = u.id
       ${where}
       ORDER BY t.created_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      params
    );

    const countResult = await db.query(
      `SELECT COUNT(*) FROM transactions t ${where}`, params.slice(0, idx - 1)
    );

    res.json({ movements: result.rows, total: parseInt(countResult.rows[0].count) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── DASHBOARD SUMMARY ───────────────────────────────────────────────────────

exports.getDashboardSummary = async (req, res) => {
  const { branch_id } = req.query;
  const branchFilter = branch_id ? `WHERE i.branch_id = ${parseInt(branch_id)}` : '';

  try {
    // Get branch name if filtering by branch
    let branchName = null;
    if (branch_id) {
      const branchResult = await db.query('SELECT name FROM branches WHERE id = $1', [parseInt(branch_id)]);
      branchName = branchResult.rows[0]?.name || null;
    }

    const totalStock = await db.query(
      `SELECT COALESCE(SUM(i.quantity), 0) as total FROM inventory i ${branchFilter}`
    );

    const totalValue = await db.query(
      `SELECT COALESCE(SUM(i.quantity * p.price), 0) as value
       FROM inventory i JOIN products p ON i.product_id = p.id
       ${branchFilter}`
    );

    const lowStock = await db.query(
      `SELECT COUNT(*) FROM inventory i
       WHERE i.quantity > 0 AND i.quantity <= i.min_stock_level
       ${branchFilter ? 'AND i.branch_id = ' + parseInt(branch_id) : ''}`
    );

    const outOfStock = await db.query(
      `SELECT COUNT(*) FROM inventory i WHERE i.quantity = 0
       ${branchFilter ? 'AND i.branch_id = ' + parseInt(branch_id) : ''}`
    );

    const categories = await db.query(
      `SELECT p.category, COUNT(*) as count FROM products p 
       WHERE p.category IS NOT NULL 
       GROUP BY p.category ORDER BY count DESC`
    );

    // Get total product count
    const totalProducts = await db.query(
      `SELECT COUNT(*) as count FROM products WHERE status = 'active'`
    );

    res.json({
      total_stock: parseInt(totalStock.rows[0].total),
      total_value: parseFloat(totalValue.rows[0].value),
      low_stock_count: parseInt(lowStock.rows[0].count),
      out_of_stock_count: parseInt(outOfStock.rows[0].count),
      total_products: parseInt(totalProducts.rows[0].count),
      categories: categories.rows,
      branch_name: branchName
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── BATCHES ─────────────────────────────────────────────────────────────────

exports.addBatch = async (req, res) => {
  const { product_id, branch_id, batch_number, quantity, expiry_date } = req.body;
  const ip = getIP(req);
  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(
      `INSERT INTO batches (product_id, branch_id, batch_number, quantity, expiry_date)
       VALUES ($1,$2,$3,$4,$5)`,
      [product_id, branch_id, batch_number, quantity, expiry_date || null]
    );

    await client.query(
      `INSERT INTO inventory (product_id, branch_id, quantity)
       VALUES ($1,$2,$3)
       ON CONFLICT (product_id, branch_id)
       DO UPDATE SET quantity = inventory.quantity + $3, last_updated = NOW()`,
      [product_id, branch_id, quantity]
    );

    await client.query(
      `INSERT INTO transactions (product_id, dest_branch_id, type, quantity, user_id, status)
       VALUES ($1,$2,'receive',$3,$4,'completed')`,
      [product_id, branch_id, quantity, req.user.id]
    );

    await client.query('COMMIT');
    await logActivity(req.user.id, 'BATCH_ADDED', `Batch ${batch_number} added for product ${product_id}`, ip);
    res.status(201).json({ message: 'Batch added successfully' });
  } catch (e) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: e.message });
  } finally {
    client.release();
  }
};

// ─── BULK IMPORT ─────────────────────────────────────────────────────────────

exports.bulkImport = async (req, res) => {
  const ip = getIP(req);
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const content = fs.readFileSync(req.file.path, 'utf8');
    const records = csv.parse(content, { columns: true, skip_empty_lines: true, trim: true });

    const results = { success: 0, errors: [], skipped: 0 };

    for (const [i, row] of records.entries()) {
      const rowNum = i + 2;
      if (!row.sku || !row.name || !row.price) {
        results.errors.push({ row: rowNum, sku: row.sku || 'MISSING', name: row.name, reason: 'Missing required fields (sku, name, price)' });
        results.skipped++;
        continue;
      }

      try {
        await db.query(
          `INSERT INTO products (name, sku, description, price, cost_price, category, barcode, status)
           VALUES ($1,$2,$3,$4,$5,$6,$7,'active')
           ON CONFLICT (sku) DO UPDATE SET
             name = EXCLUDED.name, price = EXCLUDED.price,
             category = EXCLUDED.category, updated_at = NOW()`,
          [row.name, row.sku.toUpperCase(), row.description || null,
           parseFloat(row.price) || 0, parseFloat(row.cost_price) || 0,
           row.category || null, row.barcode || null]
        );
        results.success++;
      } catch (e) {
        results.errors.push({ row: rowNum, sku: row.sku, name: row.name, reason: e.message });
        results.skipped++;
      }
    }

    fs.unlinkSync(req.file.path);
    await logActivity(req.user.id, 'BULK_IMPORT', `Imported ${results.success} products, ${results.skipped} skipped`, ip);
    res.json({ message: `Import complete`, ...results });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Import failed: ' + e.message });
  }
};

// ─── SCANNER LOOKUP ──────────────────────────────────────────────────────────

exports.scanLookup = async (req, res) => {
  const { query } = req.params;
  try {
    const result = await db.query(
      `SELECT p.*, COALESCE(SUM(i.quantity), 0) as total_stock
       FROM products p
       LEFT JOIN inventory i ON p.id = i.product_id
       WHERE p.sku ILIKE $1 OR p.barcode = $1
       GROUP BY p.id LIMIT 1`,
      [query]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json({ product: result.rows[0] });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── EXPORT CSV ──────────────────────────────────────────────────────────────

exports.exportCSV = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT p.name, p.sku, p.barcode, p.category, p.brand, p.price, p.cost_price,
        p.supplier_name, COALESCE(SUM(i.quantity), 0) as total_stock, p.status
       FROM products p
       LEFT JOIN inventory i ON p.id = i.product_id
       GROUP BY p.id ORDER BY p.name`
    );

    const headers = ['Name', 'SKU', 'Barcode', 'Category', 'Brand', 'Price (RWF)', 'Cost Price (RWF)', 'Supplier', 'Total Stock', 'Status'];
    const rows = result.rows.map(p => [
      p.name, p.sku, p.barcode || '', p.category || '', p.brand || '',
      p.price, p.cost_price, p.supplier_name || '', p.total_stock, p.status
    ]);

    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=inventory_export.csv');
    res.send(csv);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── SERIAL NUMBERS ──────────────────────────────────────────────────────────

exports.getSerialNumbers = async (req, res) => {
  const { product_id } = req.params;
  const { status } = req.query;
  let conditions = ['sn.product_id = $1'];
  let params = [product_id];
  let idx = 2;

  if (status && status !== 'all') {
    conditions.push(`sn.status = $${idx++}`);
    params.push(status);
  }

  try {
    const result = await db.query(
      `SELECT sn.*, b.name as branch_name
       FROM serial_numbers sn
       LEFT JOIN branches b ON sn.branch_id = b.id
       WHERE ${conditions.join(' AND ')}
       ORDER BY sn.created_at DESC`,
      params
    );
    res.json({ serials: result.rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addSerialNumbers = async (req, res) => {
  const { product_id } = req.params;
  const { branch_id, serial_numbers } = req.body; // serial_numbers is an array of strings
  const ip = getIP(req);

  if (!Array.isArray(serial_numbers) || serial_numbers.length === 0) {
    return res.status(400).json({ message: 'Provide at least one serial number' });
  }

  const results = { added: 0, duplicates: [], errors: [] };

  try {
    for (const sn of serial_numbers) {
      const trimmed = sn.trim();
      if (!trimmed) continue;
      try {
        await db.query(
          `INSERT INTO serial_numbers (product_id, branch_id, serial_number, status)
           VALUES ($1, $2, $3, 'in_stock')`,
          [product_id, branch_id, trimmed]
        );
        results.added++;
      } catch (e) {
        if (e.code === '23505') { // unique violation
          results.duplicates.push(trimmed);
        } else {
          results.errors.push(trimmed);
        }
      }
    }

    await logActivity(req.user.id, 'SERIALS_ADDED', `Added ${results.added} serial numbers for product ${product_id}`, ip);
    res.status(201).json({ message: `${results.added} serial(s) added`, ...results });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateSerialStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const ip = getIP(req);
  const allowed = ['in_stock', 'sold', 'damaged', 'returned'];
  if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });

  try {
    const result = await db.query(
      `UPDATE serial_numbers SET status = $1, sold_at = $2 WHERE id = $3 RETURNING *`,
      [status, status === 'sold' ? new Date() : null, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Serial not found' });
    await logActivity(req.user.id, 'SERIAL_STATUS_UPDATED', `Serial #${result.rows[0].serial_number} → ${status}`, ip);
    res.json({ serial: result.rows[0] });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};
