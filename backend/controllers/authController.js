const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const db = require('../db');

const MAX_ATTEMPTS = 5;       // lock after 5 failed logins
const LOCK_DURATION = 15;     // lock for 15 minutes

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper: log activity
const logActivity = async (user_id, action, details, ip_address) => {
  try {
    await db.query(
      'INSERT INTO activity_logs (user_id, action, details, ip_address) VALUES ($1, $2, $3, $4)',
      [user_id, action, details, ip_address]
    );
  } catch (e) {
    console.error('Activity log error:', e.message);
  }
};

// Helper: get client IP
const getIP = (req) => req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

exports.register = async (req, res) => {
  const { name, email, password, role, branch_id } = req.body;
  const ip = getIP(req);

  // Validate role
  const allowedRoles = ['admin', 'manager', 'staff'];
  const assignedRole = allowedRoles.includes(role) ? role : 'staff';

  try {
    const userCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await db.query(
      'INSERT INTO users (name, email, password, role, branch_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, branch_id',
      [name, email, hashedPassword, assignedRole, branch_id || null]
    );

    const registeredUser = newUser.rows[0];
    const payload = { id: registeredUser.id, role: registeredUser.role, branch_id: registeredUser.branch_id };

    await logActivity(registeredUser.id, 'REGISTER', `New account created with role: ${assignedRole}`, ip);

    jwt.sign(payload, process.env.JWT_SECRET || 'supersecret_fallback', { expiresIn: '1d' }, (err, token) => {
      if (err) throw err;
      res.status(201).json({ token, user: { ...payload, name: registeredUser.name, email: registeredUser.email } });
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const ip = getIP(req);

  try {
    const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    // Record attempt regardless
    await db.query(
      'INSERT INTO login_attempts (email, ip_address, success) VALUES ($1, $2, $3)',
      [email, ip, false]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = userResult.rows[0];

    // Check if account is locked
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      const minutesLeft = Math.ceil((new Date(user.locked_until) - new Date()) / 60000);
      return res.status(423).json({
        message: `Account locked due to too many failed attempts. Try again in ${minutesLeft} minute(s).`
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      const newFailedAttempts = (user.failed_attempts || 0) + 1;

      if (newFailedAttempts >= MAX_ATTEMPTS) {
        // Lock the account
        await db.query(
          `UPDATE users SET failed_attempts = $1, locked_until = NOW() + INTERVAL '${LOCK_DURATION} minutes' WHERE id = $2`,
          [newFailedAttempts, user.id]
        );
        await logActivity(user.id, 'ACCOUNT_LOCKED', `Locked after ${newFailedAttempts} failed attempts`, ip);
        return res.status(423).json({
          message: `Too many failed attempts. Account locked for ${LOCK_DURATION} minutes.`
        });
      }

      await db.query('UPDATE users SET failed_attempts = $1 WHERE id = $2', [newFailedAttempts, user.id]);
      const remaining = MAX_ATTEMPTS - newFailedAttempts;
      return res.status(400).json({
        message: `Invalid credentials. ${remaining} attempt(s) remaining before lockout.`
      });
    }

    // Successful login — reset counters
    await db.query(
      'UPDATE users SET failed_attempts = 0, locked_until = NULL, last_login = NOW() WHERE id = $1',
      [user.id]
    );

    // Update attempt record to success
    await db.query(
      'UPDATE login_attempts SET success = true WHERE id = (SELECT id FROM login_attempts WHERE email = $1 ORDER BY attempted_at DESC LIMIT 1)',
      [email]
    );

    await logActivity(user.id, 'LOGIN', `Successful login from ${ip}`, ip);

    const payload = { id: user.id, role: user.role, branch_id: user.branch_id };

    jwt.sign(payload, process.env.JWT_SECRET || 'supersecret_fallback', { expiresIn: '1d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { ...payload, name: user.name, email: user.email } });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const ip = getIP(req);
  try {
    const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'No account found with that email' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    await db.query(
      "UPDATE users SET reset_token = $1, reset_token_expires = NOW() + INTERVAL '1 hour' WHERE email = $2",
      [resetToken, email]
    );

    await logActivity(userResult.rows[0].id, 'PASSWORD_RESET_REQUEST', `Reset requested from ${ip}`, ip);

    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: `"StockSync" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'StockSync - Password Reset Request',
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #0EA5E9, #14B8A6); border-radius: 12px; padding: 12px 20px;">
              <span style="color: white; font-size: 20px; font-weight: 800;">StockSync</span>
            </div>
          </div>
          <div style="background: white; border-radius: 12px; padding: 32px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1e293b; margin-top: 0;">Reset Your Password</h2>
            <p style="color: #64748b;">You requested a password reset for your StockSync account. Click the button below to set a new password.</p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${resetUrl}" style="background: linear-gradient(135deg, #0EA5E9, #14B8A6); color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 16px;">
                Reset Password
              </a>
            </div>
            <p style="color: #94a3b8; font-size: 13px;">This link expires in <strong>1 hour</strong>. If you didn't request this, you can safely ignore this email.</p>
          </div>
          <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 16px;">© 2026 StockSync · B Special Business Ltd</p>
        </div>
      `,
    });

    res.json({ message: 'Password reset link sent to your email.' });
  } catch (error) {
    console.error('forgotPassword error:', error);
    res.status(500).json({ message: 'Failed to send reset email. Please try again.' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  const ip = getIP(req);
  try {
    const userResult = await db.query(
      'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()',
      [token]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    const user = userResult.rows[0];
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await db.query(
      'UPDATE users SET password = $1, reset_token = NULL, reset_token_expires = NULL, failed_attempts = 0, locked_until = NULL WHERE id = $2',
      [hashedPassword, user.id]
    );

    await logActivity(user.id, 'PASSWORD_RESET', 'Password successfully reset', ip);

    res.json({ message: 'Password successfully reset' });
  } catch (error) {
    console.error('resetPassword error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.logout = async (req, res) => {
  const ip = getIP(req);
  try {
    await logActivity(req.user.id, 'LOGOUT', `User logged out from ${ip}`, ip);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, role, branch_id, last_login, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
