const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/admin', ctrl.getAdminDashboard);
router.get('/warehouse', ctrl.getWarehouseDashboard);
router.get('/retail', ctrl.getRetailDashboard);

module.exports = router;
