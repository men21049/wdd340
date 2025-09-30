const utilities = require("../utilities/");
const accountModel = require("../models/account-model");


const accntCont = {};

accntCont.buildLogin = async function (req, res, next) {
    let nav = await utilities.getNav();
    res.render("account/login",{
        title: "Login",
        nav,
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

accntCont.registerAccount = async function(req, res){
  let nav = await utilities.getNav();
  const {account_firstname, account_lastname, account_email, account_password} = req.body;
  console.log(req.body);
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  );

  if(regResult){
    req.flash(
      "congrats",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    });
  }
  else{
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    });
  }
}

module.exports = accntCont;