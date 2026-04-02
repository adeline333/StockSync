const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const bcrypt = require('bcrypt');
const db = require('../db');

const logActivity = async (user_id, action, details, ip) => {
  try {
    await db.query(
      'INSERT INTO activity_logs (user_id, action, details, ip_address) VALUES ($1, $2, $3, $4)',
      [user_id, action, details, ip]
    );
  } catch (e) { console.error('Log error:', e.message); }
};

const getIP = (req) => req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

// GET /api/profile
exports.getProfile = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, role, branch_id, phone, two_fa_enabled, last_login, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ user: result.rows[0] });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/profile
exports.updateProfile = async (req, res) => {
  const { name, phone } = req.body;
  const ip = getIP(req);
  try {
    const result = await db.query(
      'UPDATE users SET name = $1, phone = $2, updated_at = NOW() WHERE id = $3 RETURNING id, name, email, role, phone, two_fa_enabled',
      [name, phone || null, req.user.id]
    );
    await logActivity(req.user.id, 'PROFILE_UPDATE', `Name/phone updated`, ip);
    res.json({ user: result.rows[0] });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/profile/change-password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const ip = getIP(req);
  try {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const user = result.rows[0];

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    if (newPassword.length < 6) return res.status(400).json({ message: 'New password must be at least 6 characters' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);

    await db.query('UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2', [hashed, req.user.id]);
    await logActivity(req.user.id, 'PASSWORD_CHANGE', 'Password changed from profile', ip);

    res.json({ message: 'Password updated successfully' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/profile/2fa/setup — generate secret + QR code
exports.setup2FA = async (req, res) => {
  try {
    const userResult = await db.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const user = userResult.rows[0];

    const secret = speakeasy.generateSecret({
      name: `StockSync (${user.email})`,
      issuer: 'StockSync'
    });

    // Save secret temporarily (not enabled yet until verified)
    await db.query('UPDATE users SET two_fa_secret = $1 WHERE id = $2', [secret.base32, req.user.id]);

    // Generate QR code as data URL
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    res.json({ secret: secret.base32, qrCode: qrCodeUrl });
  } catch (e) {
    console.error('2FA setup error:', e);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/profile/2fa/verify — verify token and enable 2FA
exports.verify2FA = async (req, res) => {
  const { token } = req.body;
  const ip = getIP(req);
  try {
    const userResult = await db.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const user = userResult.rows[0];

    if (!user.two_fa_secret) return res.status(400).json({ message: 'Run setup first' });

    const verified = speakeasy.totp.verify({
      secret: user.two_fa_secret,
      encoding: 'base32',
      token,
      window: 1
    });

    if (!verified) return res.status(400).json({ message: 'Invalid code. Try again.' });

    await db.query('UPDATE users SET two_fa_enabled = TRUE WHERE id = $1', [req.user.id]);
    await logActivity(req.user.id, '2FA_ENABLED', '2FA successfully enabled', ip);

    res.json({ message: '2FA enabled successfully' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/profile/2fa/disable
exports.disable2FA = async (req, res) => {
  const { password } = req.body;
  const ip = getIP(req);
  try {
    const userResult = await db.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

    await db.query('UPDATE users SET two_fa_enabled = FALSE, two_fa_secret = NULL WHERE id = $1', [req.user.id]);
    await logActivity(req.user.id, '2FA_DISABLED', '2FA disabled', ip);

    res.json({ message: '2FA disabled' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};
