const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const inventoryController = require('../controllers/inventoryController');
const authMiddleware = require('../middleware/auth');

const upload = multer({ dest: path.join(__dirname, '../uploads/') });

router.use(authMiddleware);

// Dashboard summary
router.get('/summary', inventoryController.getDashboardSummary);

// Products CRUD
router.get('/products', inventoryController.getProducts);
router.get('/products/export', inventoryController.exportCSV);
router.get('/products/:id', inventoryController.getProductById);
router.post('/products', upload.single('image'), inventoryController.createProduct);
router.put('/products/:id', inventoryController.updateProduct);
router.delete('/products/:id', inventoryController.deleteProduct);

// Stock operations
router.post('/adjust', inventoryController.adjustStock);
router.post('/batch', inventoryController.addBatch);

// Movements log
router.get('/movements', inventoryController.getMovements);

// Scanner lookup
router.get('/scan/:query', inventoryController.scanLookup);

// Bulk import
router.post('/import', upload.single('file'), inventoryController.bulkImport);

// Serial numbers
router.get('/products/:product_id/serials', inventoryController.getSerialNumbers);
router.post('/products/:product_id/serials', inventoryController.addSerialNumbers);
router.put('/serials/:id/status', inventoryController.updateSerialStatus);

module.exports = router;
