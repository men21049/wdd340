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

invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav();
  try{
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
  });
  }
  catch(error){
    console.error("Error rendering management view: ", error);
    res.status(500).send("An error occurred while processing your request."); 
  }
}

invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  try{
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
  });
  }
  catch(error){
    console.error("Error rendering add classification view: ", error);
    res.status(500).send("An error occurred while processing your request."); 
  }
}

invCont.addNewClassification = async function (req, res, next) {
  const { classificationName } = req.body;
  const regResult = await invModel.addNewClassification(classificationName);
  if (regResult) {
    req.flash(
      "success",
      `The new classification ${classificationName} was added successfully.`
    );
    res.redirect("/inv/management/addNewClassification");
  } else {
    req.flash("error", "Sorry, the new classification was not added.");
    res.redirect("/inv/management/addNewClassification");
  }
};


invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  try{
  res.render("./inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    classificationSelect,
  });
  }
  catch(error){
    console.error("Error rendering add inventory view: ", error);
    res.status(500).send("An error occurred while processing your request."); 
  }
} 

invCont.addNewInventory = async function (req,res,nect) {
  const { classification_id,inv_make,inv_model,inv_description,inv_image,inv_thumbnail,inv_price,inv_year,inv_miles,inv_color } = req.body;

  let invimage = (!inv_image) ? '/images/vehicles/no-image.png':inv_image;
  let invthumbnail = (!inv_thumbnail) ? '/images/vehicles/no-image-tn.png':inv_thumbnail;
    
  const regResult = await invModel.addNewInventory(classification_id,inv_make,inv_model,inv_description,invimage,invthumbnail,inv_price,inv_year,inv_miles,inv_color);
  if (regResult) {
    req.flash(
      "success",
      `The new inventory item ${inv_make} ${inv_model} was added successfully.`
    );
    res.redirect("/inv/management/addNewInventory");
  } else {
    req.flash("error", "Sorry, the new inventory item was not added.");
    res.redirect("/inv/management/addNewInventory");
  } 
}

module.exports = invCont;