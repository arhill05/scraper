const scraper = require('./scraper');
const replacementParser = require('../utils/replacementParser');
const logger = require('../utils/logger');
const errorCodes = require('../errorCodes');

exports.xpath = async (req, res, next) => {
  const options = {
    url: req.query.url,
    xpath: req.query.xpath,
    configKey: req.query.configKey,
    replacements:
      req.query.replacements != null ? replacementParser(req.query.replacements) : null,
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
    let response = {
      message: 'An error has occurred',
      error: err.message,
      code: err.code ? err.code : errorCodes.UnknownError
    };
    if (process.env.IS_PRODUCTION === 'false') {
      response = { ...response, stack: err.stack };
    }
    res.status(500).send(response);
  }
};

exports.fullHtml = async (req, res, next) => {
  const options = {
    ...req.query,
    replacements:
      req.query.replacements != null ? replacementParser(req.query.replacements) : null
  };
  try {
    logger.logInfo(`entering fullHtml endpoint`);
    logger.logInfo('Options:\n', options);
    const result = await scraper.scrapeUrlForFullHtml(options);
    res.send(result);
  } catch (err) {
    let response = {
      message: 'An error has occurred',
      error: err.message,
      code: err.code ? err.code : errorCodes.UnknownError
    };
    if (!process.env.IS_PRODUCTION === 'false') {
      response = { ...response, stack: err.stack };
    }
    res.status(500).send(response);
  }
};

exports.test = async (req, res, next) => {
  logger.logInfo('entering test');
  const options = {
    url: req.query.url,
    waitTime: req.query.waitTime,
    configKey: req.query.configKey,
    replacements:
      req.query.replacements != null ? replacementParser(req.query.replacements) : null
  };
  const result = await scraper.test(options);
  res.send(result);
};
