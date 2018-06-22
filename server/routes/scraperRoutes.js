const express = require('express');
const router = express.Router();
const scraper = require('../scraper');
const errorCodes = require('../../server/errorCodes');
const logger = require('../utils/logger');

router.get('/xpath', async (req, res, next) => {
  const options = {
    url: req.query.url,
    xpath: req.query.xpath,
    replacements: scraper.parseReplacements(req.query.replacements),
    waitTime: req.query.waitTime,
    collection: req.query.collection,
    subcollection: req.query.subcollection,
    function: req.query.function,
    synchronization: req.query.synchronization,
    enqueueType: req.query.enqueueType,
    crawlType: req.query.crawlType,
    forceAllow: req.query.forceAllow
  };
  try {
    logger.logInfo(`entering xpath endpoint`);
    logger.logInfo('Options:\n', options);
    const result = await scraper.scrapeUrlForXpath(options);
    res.send(result);
  } catch (err) {
    res.status(500).send({
      message: 'An error has occurred',
      error: err.message,
      stack: process.env.IS_PRODUCTION ? null : err.stack
    });
  }
});

router.get('/fullHtml', async (req, res, next) => {
  const options = {
    url: req.query.url,
    waitTime: req.query.waitTime,
    replacements:
      req.query.replacements != null
        ? scraper.parseReplacements(req.query.replacements)
        : null
  };
  try {
    logger.logInfo(`entering fullHtml endpoint`);
    logger.logInfo('Options:\n', options);
    const result = await scraper.scrapeUrlForFullHtml(options);
    res.send(result);
  } catch (err) {
    res.status(500).send({
      message: 'An error has occurred',
      error: err.message,
      code: err.code ? err.code : errorCodes.UnknownError,
      stack: process.env.IS_PRODUCTION ? null : err.stack
    });
  }
});

module.exports = router;