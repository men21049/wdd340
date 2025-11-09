const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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
    });
    return;
  }
  try {
    if (await bcrypt.compareSync(account_password, accountData.account_password)) {
      delete accountData.account_password;
      req.session.accountData = accountData;
      res.redirect("/account/");
    } else {
      req.flash("notice", "Please check your credentials and try again.");
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
      });
    }
  } catch (error) {
    console.error(error);
    req.flash("notice", "An error occurred. Please try again.");
    res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  }
};

accntCont.logoutAccount = async function(req, res){
  req.session.destroy();
  res.redirect("/");
};

module.exports = accntCont;