const express = require('express');
const router = express.Router();
const util = require('../utilities/index');
const searchController = require('../controllers/searchController');

// Route to build search view
router.get('/', util.handleErrors(searchController.buildSearchView));

// Route to handle search form submission
router.post('/', util.handleErrors(searchController.getSearchInv));

// Route to display popular searches
router.get('/popular-searches',util.checkAccountType, util.handleErrors(searchController.displayPopularSearches));

// Route to build search results view
router.get('/results/:search_criteria', util.handleErrors(searchController.buildSearchResults));

module.exports = router;
