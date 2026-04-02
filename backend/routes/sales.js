const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.post('/orders', salesController.createOrder);
router.get('/orders', salesController.getOrders);
router.get('/orders/:id', salesController.getOrderById);
router.post('/orders/:id/void', salesController.voidOrder);
router.get('/summary', salesController.getDailySummary);

module.exports = router;
