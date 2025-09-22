const utilities = require("../utilities/");
const footer ={};

footer.linkFooter = async function (req, res, next) {
    try{
      throw new Error("A serious error occurred.");
    }
    catch(error){
      const nav = await utilities.getNav();
      res.status(500).render("error/errors", {
          title: "Server Error",
          message: "500 - An error occurred while processing your request.",
          nav,
      });
    }
}


module.exports = footer;
