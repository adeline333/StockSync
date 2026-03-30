const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Public route: Register
router.post('/register', authController.register);

// Public route: Login
router.post('/login', authController.login);

// Protected route snippet: Get the currently logged-in user info
router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
