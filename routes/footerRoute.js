const express = require('express');
const router = express.Router();
const footerController = require('../controllers/footerController');

// Route to get all inventory items
router.get('/', footerController.linkFooter);

module.exports = router;
