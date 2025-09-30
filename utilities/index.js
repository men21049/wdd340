const invModel = require("../models/inventory-model");
const Util = {};

/* ***********************
 * Constructs the nav HTML unordered list
 ************************* */

Util.getNav = async function (req,res,next){
    let data = await invModel.getClassifications();
    let list = "<ul>";
    list += '<li><a href="/" title="Home page">Home</a></li>';

    data.rows.forEach((row)=>{
        list += "<li>";
        list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>";
        list += "</li>";
    })
    list += "</ul>";
    return list;
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid = '';
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span class="price">$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildInventoryDetail = async function(data){
  let detail = '';
  if(data.length > 0){
    detail += '<div id="detail-display">'
    detail += '<img src="' + data[0].inv_image + '" alt="Image of ' 
    + data[0].inv_make + ' ' + data[0].inv_model + ' on CSE Motors" />'
    detail += '<div class="namePrice">'
    detail += '<h2>' + data[0].inv_make + ' ' + data[0].inv_model + '</h2>'
    detail += '<span class="price">$' 
    + new Intl.NumberFormat('en-US').format(data[0].inv_price) + '</span>'
    detail += '</div>'
    detail += '<div class="detailInfo">'
    detail += '<h3>Details</h3>'
    detail += '<hr />'
    detail += '<p><strong>Description: </strong>' + data[0].inv_description + '</p>'
    detail += '<p><strong>Color: </strong>' + data[0].inv_color + '</p>'
    detail += '<p><strong>Year: </strong>' + data[0].inv_year + '</p>'
    detail += '<p><strong>Miles: </strong>'
    + new Intl.NumberFormat('en-US').format(data[0].inv_miles) + '</p>'
    detail += '</div>'
    detail += '</div>'
  } else { 
    detail += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return detail
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util;