const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reconciliationController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.post('/run', ctrl.runReconciliation);
router.get('/', ctrl.getReconciliations);
router.get('/latest', ctrl.getLatest);
router.get('/:id', ctrl.getById);
router.post('/items/:id/resolve', ctrl.resolveItem);

module.exports = router;
