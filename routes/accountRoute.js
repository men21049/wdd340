const express = require('express');
const router = express.Router();
const util = require('../utilities/index');
const regValidate = require('../utilities/account-validation');
const accountController = require("../controllers/accountController");

// Route definitions for account management
router.get('/login',util.handleErrors(accountController.buildLogin));
router.get('/registration', util.handleErrors(accountController.buildRegister));
router.get('/', util.handleErrors(accountController.buildAccountManagement));
router.get('/logout', util.handleErrors(accountController.logoutAccount));

// Handle form submissions with validation middleware
router.post('/register',
    regValidate.registationRules(),
    regValidate.checkRegData,
    util.handleErrors(accountController.registerAccount));

router.post('/login',
    regValidate.loginRules(),
    util.handleErrors(accountController.loginAccount));



module.exports = router;
