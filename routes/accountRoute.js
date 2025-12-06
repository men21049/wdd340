const express = require('express');
const router = express.Router();
const util = require('../utilities/index');
const regValidate = require('../utilities/account-validation');
const accountController = require("../controllers/accountController");

// Route definitions for account management
router.get('/login',util.handleErrors(accountController.buildLogin));
router.get('/registration', util.handleErrors(accountController.buildRegister));
router.get('/',util.checkLogin, util.handleErrors(accountController.buildAccountManagement));
router.get('/logout', util.handleErrors(accountController.logoutAccount));
router.get('/update/:id', util.checkLogin, util.handleErrors(accountController.buildUpdateAccount));

// Handle form submissions with validation middleware
router.post('/register',
    regValidate.registationRules(),
    regValidate.checkRegData,
    util.handleErrors(accountController.registerAccount));

router.post('/login',
    regValidate.loginRules(),
    util.handleErrors(accountController.loginAccount));

router.post('/update/',
    util.checkLogin,
    regValidate.accountUpdateRules(),
    regValidate.checkAccountUpdateData,
    util.handleErrors(accountController.updateAccount))

router.post('/update-passsword/',
    util.checkLogin,
    regValidate.updatePasswordRules(),
    regValidate.checkUpdatePasswordData,
    util.handleErrors(accountController.updatePassword));

module.exports = router;
