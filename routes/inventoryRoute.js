const express = require('express');
const router = express.Router();
const util = require('../utilities/index');
const regValidate = require('../utilities/inventory-validation');
const inventoryController = require('../controllers/invController');

// Route to get all inventory items
router.get('/getInventory/:classification_id', util.handleErrors(inventoryController.getInventoryJSON));
router.get('/edit/:id', util.handleErrors(inventoryController.editInventoryById));

// Routes to build views for inventory
router.get('/type/:classificationId', util.handleErrors(inventoryController.buildByClassificationId));
router.get('/detail/:inventoryId', util.handleErrors(inventoryController.detailByInventoryId));
router.get('/management', util.handleErrors(inventoryController.buildManagementView));
router.get('/management/addNewClassification',  util.handleErrors(inventoryController.addClassification));
router.get('/management/addNewInventory',  util.handleErrors(inventoryController.addInventory));

// Route to handle post requests for adding new classification and inventory
router.post('/management/addNewClassification',
             regValidate.classificationRules() ,
             util.handleErrors(inventoryController.addNewClassification));

router.post('/management/addNewInventory',
            regValidate.inventoryRules(),
            regValidate.checkInvData,
            util.handleErrors(inventoryController.addNewInventory));

router.post('/update/', 
            regValidate.checkUpdateData,
            util.handleErrors(inventoryController.editInventoryById));

module.exports = router;
