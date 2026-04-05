const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/forecast', ctrl.getForecast);
router.get('/stockout-risk', ctrl.getStockOutRisk);
router.get('/reorder', ctrl.getReorderRecommendations);

module.exports = router;
