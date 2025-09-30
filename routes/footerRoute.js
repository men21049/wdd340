const express = require('express');
const router = express.Router();
const util = require('../utilities/index');
const footerController = require('../controllers/footerController');

// Route to get all inventory items
router.get('/', util.handleErrors(footerController.linkFooter));

module.exports = router;
