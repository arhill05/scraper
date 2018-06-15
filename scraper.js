const Nightmare = require('nightmare');
const config = require('./config');
const axios = require('axios');

exports.scrapeUrlForXpath = async options => {
  const nightmare = Nightmare({ show: false });
  let wait = options.waitTime ? Number(options.waitTime) : 1000;
  let result = null;
  this.logInfo(`begin scrape`);
  this.logInfo(`scraping ${options.url} for xpath ${options.xpath}`);
  try {
    result = await nightmare
      .goto(options.url)
      .wait(wait)
      .evaluate(xpath => {
        var result = document.evaluate(
          xpath,
          document,
          null,
          XPathResult.ANY_TYPE,
          null
        );
        var node,
          nodes = [];
        while ((node = result.iterateNext())) nodes.push(node.nodeValue);
        return nodes;
      }, options.xpath)
      .end();

    this.logInfo(`end scrape`);
    await sendResults(result, options);
    return result;
  } catch (err) {
    this.logError(`error while scraping: ${err}`);
    throw err;
  }
};

exports.scrapeUrlForFullHtml = async options => {
  const nightmare = Nightmare({ show: false });
  let wait = options.waitTime ? Number(options.waitTime) : 1000;
  let result = null;
  this.logInfo(`begin scrapeUrlForFullHtml`);
  try {
    result = await nightmare
      .goto(options.url)
      .wait(wait)
      .evaluate(() => document.body.innerHTML)
      .end();
    this.logInfo(`end scrapeUrlForFullHtml`);
    result = replaceSubstrings(result, options.replacements);
    return result;
  } catch (err) {
    this.logError(`error while scrapeUrlForFullHtml: ${err}`);
    throw err;
  }
};

exports.scrapeUrlForNode = async options => {
  const nightmare = Nightmare({ show: false });
  let result = null;
  this.logInfo(`begin scrape`);
  this.logInfo(`scraping ${options.url} for node ${options.node}`);
  try {
    result = await nightmare
      .goto(options.url)
      .wait(options.node)
      .evaluate(node => {
        let result = [];
        document.querySelectorAll(node).forEach(el => {
          result.push(el.innerHtml);
        });
      }, options.node)
      .end();
  } catch (err) {
    this.logError(`error while scraping: ${err}`);
    throw err;
  }
  this.logInfo(`end scrape`);
  await sendResults(result);
  return result;
};

sendResults = async (data, options) => {
  this.logInfo(`begin crawler request`);
  const replacements = config.dataReplacements;
  let url = config.apiUrl;
  let results = [];
  try {
    if (data instanceof Array) {
      for (let item of data) {
        replacements.forEach(r => {
          item = item.replace(r.replaceThis, r.withThis);
        });
        let eachUrl = constructUrl(url, item, options);
        const response = await axios.get(eachUrl);
        results.push(response.data);
      }
    } else {
      let itemUrl = constructUrl(url, data, options);
      console.log(itemUrl);
      const response = await axios.get(itemUrl);
      results.push(response.data);
    }
  } catch (err) {
    this.logError(`error while scraping: ${err}`);
    throw err;
  }
  this.logInfo(`end crawler request`);
  return results;
};

constructUrl = (url, item, options) => {
  item = replaceSubstrings(item, options.replacements);
  let resultUrl = `${url}?url=${encodeURIComponent(item)}`;
  resultUrl += `&v.username=${config.username}&v.password=${
    config.password
  }&v.indent=true&v.app=api-rest`;
  resultUrl += `&collection=${
    options.collection ? options.collection : 'example-metadata'
  }`;
  resultUrl += `&v.function=${
    options.function ? options.function : 'search-collection-enqueue-url'
  }`;
  if (options.subcollection) {
    resultUrl += `&subcollection=${options.subcollection}`;
  }
  if (options.synchronization) {
    resultUrl += `&synchronization=${options.synchronization}`;
  }
  if (options.enqueueType) {
    resultUrl += `&enqueue-type=${options.enqueueType}`;
  }
  if (options.crawlType) {
    resultUrl += `&crawl-type=${options.crawlType}`;
  }
  if (options.forceAllow) {
    resultUrl += `&force-allow=${options.forceAllow}`;
  }

  return resultUrl;
};

exports.logInfo = (message, ...params) => {
  if (!config.isProduction) {
    console.log(`[INFO] ${message}`, params ? params : null);
  }
};

exports.logError = (message, ...params) => {
  if (!config.isProduction) {
    console.error(`[ERROR] ${message}`, params);
  }
};

exports.parseReplacements = replacements => {
  const response = [];
  let replacementsArray = [];
  if (Array.isArray(replacements)) {
    replacementsArray = replacements;
  } else {
    replacementsArray = [replacements];
  }
  replacementsArray.forEach(replacement => {
    const separated = replacement.split(',');
    response.push({ replaceThis: separated[0], withThis: separated[1] });
  });

  return response;
};

replaceSubstrings = (item, replacements) => {
  if (replacements && replacements.length) {
    replacements.forEach(r => {
      item = item.replace(new RegExp(r.replaceThis, 'g'), r.withThis);
    });
  }
  return item;
};
