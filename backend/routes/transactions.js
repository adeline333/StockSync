const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/auth');

// All transaction routes are protected
router.use(authMiddleware);

// Route to handle receiving new stock from supplier
router.post('/receive', transactionController.receive);

// Route to handle selling stock
router.post('/sale', transactionController.sale);

// Route to handle transferring stock between branches
router.post('/transfer', transactionController.transfer);

module.exports = router;
