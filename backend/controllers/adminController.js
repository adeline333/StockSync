const db = require('../db');
const bcrypt = require('bcrypt');

const logActivity = async (user_id, action, details, ip) => {
  try {
    await db.query('INSERT INTO activity_logs (user_id, action, details, ip_address) VALUES ($1,$2,$3,$4)', [user_id, action, details, ip]);
  } catch (e) { console.error('Log error:', e.message); }
};
const getIP = (req) => req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

// ─── USER MANAGEMENT ─────────────────────────────────────────────────────────

exports.getUsers = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT u.id, u.name, u.email, u.role, u.branch_id, u.last_login, u.created_at,
        u.failed_attempts, u.locked_until,
        b.name as branch_name
       FROM users u
       LEFT JOIN branches b ON u.branch_id = b.id
       ORDER BY u.created_at DESC`
    );
    res.json({ users: result.rows });
  } catch (e) {
    console.error('Get users error:', e);
    res.status(500).json({ message: 'Server error', error: e.message });
  }
};

exports.updateUserRole = async (req, res) => {
  const { role, branch_id } = req.body;
  const ip = getIP(req);
  const allowedRoles = ['admin', 'manager', 'staff', 'auditor'];
  if (!allowedRoles.includes(role)) return res.status(400).json({ message: 'Invalid role' });

  try {
    const result = await db.query(
      'UPDATE users SET role=$1, branch_id=$2 WHERE id=$3 RETURNING id, name, email, role, branch_id',
      [role, branch_id || null, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    await logActivity(req.user.id, 'USER_ROLE_UPDATED', `User ${result.rows[0].name} role changed to ${role}`, ip);
    res.json({ user: result.rows[0] });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.unlockUser = async (req, res) => {
  const ip = getIP(req);
  try {
    const result = await db.query(
      'UPDATE users SET locked_until=NULL, failed_attempts=0 WHERE id=$1 RETURNING name',
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    await logActivity(req.user.id, 'USER_UNLOCKED', `Account unlocked for ${result.rows[0].name}`, ip);
    res.json({ message: 'User unlocked' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deactivateUser = async (req, res) => {
  const ip = getIP(req);
  if (parseInt(req.params.id) === req.user.id) return res.status(400).json({ message: 'Cannot deactivate yourself' });
  try {
    await db.query('DELETE FROM users WHERE id=$1', [req.params.id]);
    await logActivity(req.user.id, 'USER_DELETED', `User ID ${req.params.id} removed`, ip);
    res.json({ message: 'User removed' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── PRODUCT CATEGORIES ───────────────────────────────────────────────────────

exports.getCategories = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT category, COUNT(*) as product_count
       FROM products WHERE category IS NOT NULL
       GROUP BY category ORDER BY category ASC`
    );
    res.json({ categories: result.rows });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.renameCategory = async (req, res) => {
  const { old_name, new_name } = req.body;
  const ip = getIP(req);
  try {
    await db.query('UPDATE products SET category=$1 WHERE category=$2', [new_name, old_name]);
    await logActivity(req.user.id, 'CATEGORY_RENAMED', `Category "${old_name}" renamed to "${new_name}"`, ip);
    res.json({ message: 'Category renamed' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteCategory = async (req, res) => {
  const { category } = req.params;
  const ip = getIP(req);
  try {
    await db.query('UPDATE products SET category=NULL WHERE category=$1', [decodeURIComponent(category)]);
    await logActivity(req.user.id, 'CATEGORY_DELETED', `Category "${category}" removed`, ip);
    res.json({ message: 'Category removed from products' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── BACKUP ───────────────────────────────────────────────────────────────────

exports.triggerBackup = async (req, res) => {
  const ip = getIP(req);
  try {
    await db.query('UPDATE system_settings SET last_backup=NOW() WHERE id=1');
    await logActivity(req.user.id, 'MANUAL_BACKUP', 'Manual backup triggered', ip);
    res.json({ message: 'Backup recorded', timestamp: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── DATA EXPORT ─────────────────────────────────────────────────────────────

exports.exportAllData = async (req, res) => {
  try {
    const [products, customers, orders, branches] = await Promise.all([
      db.query('SELECT * FROM products ORDER BY name'),
      db.query('SELECT * FROM customers ORDER BY name'),
      db.query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 1000'),
      db.query('SELECT * FROM branches ORDER BY name'),
    ]);

    const exportData = {
      exported_at: new Date().toISOString(),
      company: 'B SPECIAL BUSINESS LTD',
      products: products.rows,
      customers: customers.rows,
      orders: orders.rows,
      branches: branches.rows,
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=stocksync_export.json');
    res.json(exportData);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── API KEYS ─────────────────────────────────────────────────────────────────

exports.getApiKeys = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM api_keys WHERE user_id=$1 ORDER BY created_at DESC', [req.user.id]);
    res.json({ keys: result.rows });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.generateApiKey = async (req, res) => {
  const { name } = req.body;
  const ip = getIP(req);
  const crypto = require('crypto');
  const key = `sk_live_${crypto.randomBytes(24).toString('hex')}`;
  try {
    const result = await db.query(
      'INSERT INTO api_keys (user_id, name, key_value) VALUES ($1,$2,$3) RETURNING *',
      [req.user.id, name || 'API Key', key]
    );
    await logActivity(req.user.id, 'API_KEY_GENERATED', `API key "${name}" created`, ip);
    res.status(201).json({ key: result.rows[0] });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.revokeApiKey = async (req, res) => {
  const ip = getIP(req);
  try {
    await db.query('DELETE FROM api_keys WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
    await logActivity(req.user.id, 'API_KEY_REVOKED', `API key ID ${req.params.id} revoked`, ip);
    res.json({ message: 'API key revoked' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};
