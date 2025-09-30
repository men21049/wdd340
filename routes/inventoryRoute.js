const express = require('express');
const router = express.Router();
const util = require('../utilities/index');
const inventoryController = require('../controllers/invController');

// Route to get all inventory items
router.get('/type/:classificationId', util.handleErrors(inventoryController.buildByClassificationId));
router.get('/detail/:inventoryId', util.handleErrors(inventoryController.detailByInventoryId));

module.exports = router;
