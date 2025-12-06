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
  

  const classificationSelect = await utilities.buildClassificationList();

  try{
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,

    classificationSelect,
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
  const { classification_name } = req.body;
  const regResult = await invModel.addNewClassification(classification_name);
  if (regResult) {
    req.flash(
      "success",
      `The new classification ${classification_name} was added successfully.`
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

invCont.addNewInventory = async function (req,res,next) {
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

invCont.getInventoryJSON = async function (req, res, next) {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(classification_id);
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
}

invCont.editInventoryView = async function (req, res, next) {
  
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  

  const itemDataResult = await invModel.getInventoryById(inv_id);
  const itemData = Array.isArray(itemDataResult)
    ? itemDataResult[0]
    : itemDataResult;

  if (!itemData) {
    return res.status(404).render("errors/404", {
      title: "Inventory item not found",
      nav,
  
    });
  }
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,

    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  });
}
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  

  const { inv_id, classification_id,inv_make,inv_model,inv_description,inv_image,inv_thumbnail,inv_price,inv_year,inv_miles,inv_color } = req.body;
  
  let invimage = (!inv_image) ? '/images/vehicles/no-image.png':inv_image;
  let invthumbnail = (!inv_thumbnail) ? '/images/vehicles/no-image-tn.png':inv_thumbnail;
    
  const regResult = await invModel.updateInventory(inv_id,classification_id,inv_make,inv_model,inv_description,invimage,invthumbnail,inv_price,inv_year,inv_miles,inv_color);
  
  if (regResult) {
    const itemName = regResult.inv_make + " " + regResult.inv_model;
    req.flash("success", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/management/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id);
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,

    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    });
  }
}

invCont.deleteInventoryView = async function (req, res, next) {
    
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  

  const itemDataResult = await invModel.getInventoryById(inv_id);
  const itemData = Array.isArray(itemDataResult)
    ? itemDataResult[0]
    : itemDataResult;

  if (!itemData) {
    return res.status(404).render("errors/404", {
      title: "Inventory item not found",
      nav,
  
    });
  }
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/delete-confirm", {
    title: "Edit " + itemName,
    nav,

    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  });
}

invCont.deleteInventory = async function (req, res, next) {
  const { inv_id } = req.body;
  
  const regResult = await invModel.deleteInventory(inv_id);
  
  if (regResult) {
    req.flash("success", `The inventory item was successfully deleted.`);
    res.redirect("/inv/management/");
  } else {
    req.flash("error", "Sorry, the delete failed.");
    res.redirect("/inv/management/");
  }
}
module.exports = invCont;