const express = require('express');
const router = express.Router();
const scraperController = require('../scraper/scraperController');

router.get('/xpath', scraperController.xpath);
router.get('/fullHtml', scraperController.fullHtml);

module.exports = router;
