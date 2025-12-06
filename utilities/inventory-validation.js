const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};


validate.classificationRules = () => {
    return [
      // classification name is required and must be string
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a classification name."), // on error this message is sent.
    ]
  };

validate.inventoryRules = () => {
    return [
        // inv_make is required and must be string
            body("inv_make")
                .trim()
                .escape()
                .notEmpty()
                .isLength({ min: 2 })
                .withMessage("Please provide a make."), // on error this message is sent.
        // inv_model is required and must be string
            body("inv_model")
                .trim()
                .escape()
                .notEmpty()
                .isLength({ min: 1 })
                .withMessage("Please provide a model."), // on error this message is sent.
        // inv_description is required and must be string
            body("inv_description")
                .trim()
                .escape()
                .notEmpty()
                .isLength({ min: 10 })
                .withMessage("Please provide a description."), // on error this message is sent.
        // inv_price is required and must be decimal
            body("inv_price")
                .trim()
                .escape()
                .notEmpty()
                .isDecimal()
                .withMessage("Please provide a price."), // on error this message is sent.
        // inv_year is required and must be int
            body("inv_year")
                .trim()
                .escape()
                .notEmpty()
                .isInt()
                .withMessage("Please provide a year."), // on error this message is sent.
        // inv_miles is required and must be int
            body("inv_miles")
                .trim()
                .escape()
                .notEmpty()
                .isInt()
                .withMessage("Please provide a mileage."), // on error this message is sent.
        // inv_color is required and must be string
            body("inv_color")
                .trim()
                .escape()
                .notEmpty()
                .isLength({ min: 3 })
                .withMessage("Please provide a color."), // on error this message is sent.
        // classification_id is required and must be int
            body("classification_id")
                .trim()
                .escape()
                .notEmpty()
                .isInt()
                .withMessage("Please provide a classification."), // on error this message is sent.
    ]
};
      
validate.checkInvData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        

        const classificationSelect = await utilities.buildClassificationList();
        res.render("inventory/add-inventory", {
        title: "Add Inventory",
        nav,

        classificationSelect,
        errors: errors.array(),
        classification_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color
        });
        return;
    }
    next();
};


validate.checkUpdateData = async (req, res, next) => {
    const { inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id,inv_id } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        

        const classificationSelect = await utilities.buildClassificationList();
        res.render("inventory/edit-inventory", {
        title: "Add Inventory",
        nav,

        classificationSelect,
        errors: errors.array(),
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id,
        inv_id
        });
        return;
    }
    next();
}
module.exports = validate;

