const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  try{
    res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
  }
  catch(error){
    console.error("Error rendering classification view: ", error);
    res.status(500).send("An error occurred while processing your request.");
 }
}

invCont.detailByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId;
  const data = await invModel.detailByInventoryId(inventory_id);
  const grid = await utilities.buildInventoryDetail(data);
  let nav = await utilities.getNav();
  try{
  res.render("./inventory/details", {
    title: data[0].inv_make + ' ' + data[0].inv_model,
    nav,
    grid,
  });
  }
  catch(error){
    console.error("Error rendering detail view: ", error);
    res.status(500).send("An error occurred while processing your request."); 
  }
}

module.exports = invCont;