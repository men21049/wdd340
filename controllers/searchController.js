const e = require("connect-flash");
const searchModel = require("../models/search-model");
const utilities = require("../utilities/");

const searchCont = {};

searchCont.buildSearchView = async function (req, res, next) {
    let nav = await utilities.getNav();
    try {
        res.render("./search/search", {
            title: "Search Inventory",
            nav,
        });
    }
    catch (error) {
        console.error("Error rendering search view: ", error);
        res.status(500).send("An error occurred while processing your request.");
    }
}

searchCont.getSearchInv = async function (req, res, next) {
    let nav = await utilities.getNav();

   try {
        let account_id;
        const search_criteria = req.body.search_criteria;
        
        console.log("Search criteria received: ", search_criteria); 
        if (!search_criteria || search_criteria.trim() === '') {
            req.flash("notice", "Please enter a search term.");
            return res.redirect("/search/");
        }
        
        const results = await searchModel.searchInventory(search_criteria.trim());
        
        const results_count = results.length;
       
        if (res.locals.loggedin && res.locals.accountData) {
            account_id = res.locals.accountData.account_id;
        }
        else{
            account_id = null;
        }
        try {
            await searchModel.saveSearchHistory(account_id, search_criteria.trim(), results_count);
        } catch (historyError) {
            console.error("Error saving search history: ", historyError);
        }
    
        res.render("./search/search", {
            title: "Search Inventory",
            nav,
            results:results,
            search_criteria: search_criteria.trim(),
            results_count:results_count,
            errors: null,
        });
    }
    catch (error) {
        console.error("Error processing search: ", error);
        req.flash("notice", "An error occurred while processing your search.");
        res.render("./search/search", {
            title: "Search Inventory",
            nav,
            results: [],
            search_criteria: req.body.search_criteria || '',
            results_count: 0,
            errors: null,
        });
    }
}

searchCont.displayPopularSearches = async function (req, res, next) {
    try {
        const popularSearches = await searchModel.getPopularSearches();
        let nav = await utilities.getNav();
        res.render("./search/popular-searches", {
            title: "Popular Searches",
            nav,
            popularSearches: popularSearches || [],
            errors: null,
        });
    }
    catch (error) {
        console.error("Error displaying popular searches: ", error);
        res.status(500).send("An error occurred while processing your request.");
        res.redirect("/search/");
    }
}

searchCont.buildSearchResults = async function (req, res, next) {
    const searchTerm = req.params.searchTerm;
    try {
        const results = await searchModel.searchInventory(searchTerm);
        let nav = await utilities.getNav();
        res.render("./search/search", {
            title: "Search Inventory",
            nav,
            results:results,
            search_criteria:searchTerm,
            results_count:results.length,
            errors: null,
        });
    }
    catch (error) {
        console.error("Error building search results: ", error);
        res.status(500).send("An error occurred while processing your request.");
    }
}


module.exports = searchCont;