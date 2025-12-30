const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Trigger Scraper
router.post('/scrape', adminController.runScraper);

// Trigger AI Enhancer
router.post('/enhance', adminController.runEnhancer);

module.exports = router;
