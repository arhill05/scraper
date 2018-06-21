const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const logger = require('./utils/logger');
const configReader = require('./config/configReader');
const configController = require('./config/configController');
const errorCodes = require('./errorCodes');
const scraper = require('./scraper');
const authHandler = require('./utils/authHandler');
const config = configReader.readConfigSync();
const app = express();


app.use(bodyParser.json());
app.use(authHandler);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./public'));

app.get('/config', configController.getConfig);

app.get('/xpath', async (req, res, next) => {
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
      stack: config.isProduction ? null : err.stack
    });
  }
});

app.get('/fullHtml', async (req, res, next) => {
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
      stack: config.isProduction ? null : err.stack
    });
  }
});

const server = http.createServer(app);
const port = config.port || 3000;
server.listen(config.port || 3000, () => {
  console.log(`Scraper listening on port ${port}`);
});
