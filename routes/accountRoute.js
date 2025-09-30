const express = require('express');
const router = express.Router();
const util = require('../utilities/index');
const regValidate = require('../utilities/account-validation');
const accountController = require("../controllers/accountController");

router.get('/login',util.handleErrors(accountController.buildLogin));
router.get('/registration', util.handleErrors(accountController.buildRegister));
router.post('/register',
    regValidate.registationRules(),
    regValidate.checkRegData,
    util.handleErrors(accountController.registerAccount));

module.exports = router;
