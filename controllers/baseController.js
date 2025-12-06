const utilities = require("../utilities/");

const baseController = {};

baseController.buildHome = async function(req,res){
    const nav = await utilities.getNav();
    const welcome = await utilities.buildWelcomeMessage();
    res.render("index", { title: "Home", nav, welcome });
}

module.exports = baseController;