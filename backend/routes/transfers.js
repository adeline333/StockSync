const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/transferController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/locations/summary', ctrl.getLocationsSummary);
router.get('/', ctrl.getTransfers);
router.get('/:id', ctrl.getTransferById);
router.post('/', ctrl.createTransfer);
router.post('/:id/approve', ctrl.approveTransfer);
router.post('/:id/reject', ctrl.rejectTransfer);

module.exports = router;
