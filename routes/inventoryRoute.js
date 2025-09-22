const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/invController');

// Route to get all inventory items
router.get('/type/:classificationId', inventoryController.buildByClassificationId);
router.get('/detail/:inventoryId', inventoryController.detailByInventoryId);

module.exports = router;
