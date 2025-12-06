const express = require('express');
const router = express.Router();
const util = require('../utilities/index');
const regValidate = require('../utilities/inventory-validation');
const inventoryController = require('../controllers/invController');

// Route to get all inventory items
router.get('/getInventory/:classification_id', util.handleErrors(inventoryController.getInventoryJSON));
router.get('/edit/:inv_id', util.checkAccountType, util.handleErrors(inventoryController.editInventoryView));

// Routes to build views for inventory
router.get('/type/:classificationId', util.handleErrors(inventoryController.buildByClassificationId));
router.get('/detail/:inventoryId', util.handleErrors(inventoryController.detailByInventoryId));
router.get('/management', util.checkAccountType, util.handleErrors(inventoryController.buildManagementView));
router.get('/management/addNewClassification',  util.checkAccountType, util.handleErrors(inventoryController.addClassification));
router.get('/management/addNewInventory',  util.checkAccountType, util.handleErrors(inventoryController.addInventory));
router.get('/delete/:inv_id', util.handleErrors(inventoryController.deleteInventoryView));


// Route to handle post requests for adding new classification and inventory
router.post('/management/addNewClassification',
             util.checkAccountType,
             regValidate.classificationRules() ,
             util.handleErrors(inventoryController.addNewClassification));

router.post('/management/addNewInventory',
             util.checkAccountType,
            regValidate.inventoryRules(),
            regValidate.checkInvData,
            util.handleErrors(inventoryController.addNewInventory));

router.post('/update/', 
            util.checkAccountType,
            regValidate.inventoryRules(),
            regValidate.checkUpdateData,
            util.handleErrors(inventoryController.updateInventory));

router.post('/delete/', util.checkAccountType, util.handleErrors(inventoryController.deleteInventory));

module.exports = router;
