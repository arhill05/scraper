const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');

const config = require('./config');
const scraper = require('./scraper');
const app = express();
const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/node', async (req, res, next) => {
  const options = {
    url: req.query.url,
    node: req.query.node,
    replacements: scraper.parseReplacements(req.query.replacements),
    collection: req.query.collection,
    subcollection: req.query.subcollection,
    function: req.query.function,
    synchronization: req.query.synchronization,
    enqueueType: req.query.enqueueType,
    crawlType: req.query.crawlType,
    forceAllow: req.query.forceAllow
  };
  if (!options.url) {
    res.status(500).send('URL is required');
    return;
  }
  if (!options.node) {
    res.status(500).send('node is required');
    return;
  }
  scraper.logInfo(`entering node endpoint`);
  scraper.logInfo('Options:\n', options);
  const result = await scraper.scrapeUrlForNode(options);
  res.send(result);
});

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

  if (!options.url) {
    res.status(500).send('URL is required');
    return;
  }
  if (!options.xpath) {
    res.status(500).send('xpath is required');
    return;
  }
  scraper.logInfo(`entering xpath endpoint`);
  scraper.logInfo('Options:\n', options);
  const result = await scraper.scrapeUrlForXpath(options);
  res.send(result);
});

app.get('/fullHtml', async (req, res, next) => {
  const options = {
    url: req.query.url,
    waitTime: req.query.waitTime,
    replacements: req.query.replacements != null ? scraper.parseReplacements(req.query.replacements) : null
  };

  if (!options.url) {
    res.status(500).send('URL is required');
  }
  scraper.logInfo(`entering fullHtml endpoint`);
  scraper.logInfo('Options:\n', options);
  const result = await scraper.scrapeUrlForFullHtml(options);
  res.send(result);
});

const server = http.createServer(app);
const port = config.port || 3000;
server.listen(config.port || 3000, () => {
  console.log(`Scraper listening on port ${port}`);
});
