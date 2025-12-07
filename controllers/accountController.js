const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { parse } = require("dotenv");
require("dotenv").config();


const accntCont = {};

accntCont.buildLogin = async function (req, res, next) {
    let nav = await utilities.getNav();
    
    res.render("account/login",{
        title: "Login",
        nav,
        errors: null
    });

};

accntCont.buildRegister = async function (req, res, next){
  let nav = await utilities.getNav();
  
  res.render("account/register", {
    title: "Register",
    nav,

    errors: null
  });
};

accntCont.buildAccountManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  
  res.render("account/account-management", {
    title: "Account Management",
    nav,
    errors: null,
  });
}

accntCont.buildUpdateAccount = async function (req, res, next) {
  let nav = await utilities.getNav();
  const account_id = parseInt(req.params.id);

  if (res.locals.accountData && res.locals.accountData.account_id === account_id) {
    res.render("account/update-account", {
      title: "Update Account Information",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "You are not authorized to update this account.");
    res.redirect("/account/");
  }
}

accntCont.updateAccount = async function (req, res, next) {
  let nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_email } = req.body;
  const accountIdInt = parseInt(account_id);

  if (!res.locals.accountData || res.locals.accountData.account_id !== accountIdInt) {
    req.flash("notice", "You are not authorized to update this account.");
    return res.redirect("/account/");
  }

  const updateResult = await accountModel.updateAccountInfo(
    accountIdInt,
    account_firstname,
    account_lastname,
    account_email
  );

  if (updateResult) {
    const updatedAccountData = await accountModel.getAccountById(accountIdInt);
    
    if (updatedAccountData) {
      req.flash("success", "Your account information has been updated successfully.");
    } else {
      req.flash("notice", "Account updated but could not retrieve updated information.");
    }
  } else {
    req.flash("notice", "Sorry, the account update failed.");
  }

  res.redirect("/account/");
}

accntCont.updatePassword = async function(req, res){
  let nav = await utilities.getNav();
  const {account_id, account_password} =  req.body;
  const accountID = parseInt(account_id);
  let hashedPassword;

  if (!res.locals.accountData || res.locals.accountData.account_id !== accountID) {
    req.flash("notice", "You are not authorized to update this account.");
    return res.redirect("/account/");
  }
  
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hash(account_password, 10);
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the password update.');
    res.redirect("/account/update/" + accountID);
  }

  const updateResult = await accountModel.updatePassword(accountID, hashedPassword);
  
  if (updateResult) {
    const updatedAccountData = await accountModel.getAccountById(accountID);
    
    if (updatedAccountData) {
      if (updatedAccountData.account_password && updatedAccountData.account_password.startsWith('$2')) {
        req.flash("success", "Your password has been updated successfully.");
      } else {
        req.flash("notice", "Password update completed but verification failed.");
      }
    } else {
      req.flash("notice", "Password updated but could not retrieve account information.");
    }
  } else {
    req.flash("notice", "Sorry, the password update failed.");
  }

  res.redirect("/account/");
}

accntCont.registerAccount = async function(req, res){
  let nav = await utilities.getNav();
  

  const {account_firstname, account_lastname, account_email, account_password} = req.body;
  
  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.');
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
  
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if(regResult){
    req.flash(
      "congrats",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
  
      errors: null,
    });
  }
  else{
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
  
      errors: null,
    });
  }
}

accntCont.loginAccount = async function(req, res){
  let nav = await utilities.getNav();
  

  const {account_email, account_password} = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  
  if(!accountData){
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });

      const cookieOptions = {
        httpOnly: true,
        maxAge: 3600 * 1000,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      };
    
      res.cookie("jwt", accessToken, cookieOptions);
      return res.redirect("/account/");
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.");
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    console.error("Login error details:", error);
    console.error("Error stack:", error.stack);
    req.flash("notice", "An error occurred during login. Please try again.");
    res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email: account_email || '',
    });
  }

};

accntCont.logoutAccount = async function(req, res){
  res.clearCookie("jwt");
  req.session.destroy();
  res.redirect("/");
};

module.exports = accntCont;