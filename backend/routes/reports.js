const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reportController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/sales', ctrl.getSalesReport);
router.get('/inventory', ctrl.getInventoryReport);
router.get('/settings', ctrl.getSettings);
router.put('/settings', ctrl.saveSettings);

module.exports = router;
