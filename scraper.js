const Nightmare = require('nightmare');
const config = require('./config');
const axios = require('axios');
const errorCodes = require('./errorCodes.js');

exports.scrapeUrlForXpath = async options => {
  if (!options.url) {
    var err = new Error('URL is required');
    err.code = errorCodes.UrlRequired;
    throw err;
  }
  if (!options.xpath) {
    var err = new Error('xpath string is required');
    err.code = errorCodes.XpathRequired;
    throw err;
  }
  if (!isValidUrl(options.url)) {
    var err = new Error('URL is invalid');
    err.code = errorCodes.UrlInvalid;
    throw err;
  }
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
      .catch(handleNightmareError);

    this.logInfo(`end scrape`);
    await sendResults(result, options);
    return result;
  } catch (err) {
    this.logError(`error while scraping: ${err}`);
    throw err;
  } finally {
    nightmare.end();
  }
};

exports.scrapeUrlForFullHtml = async options => {
  if (!options.url) {
    var err = new Error('URL is required');
    err.code = errorCodes.UrlRequired;
    throw err;
  }
  if (!isValidUrl(options.url)) {
    var err = Error('URL is invalid');
    err.code = errorCodes.UrlInvalid;
    throw err;
  }
  let wait = options.waitTime ? Number(options.waitTime) : 1000;
  let result = null;
  this.logInfo(`begin scrapeUrlForFullHtml`);
  const nightmare = Nightmare({ show: false });
  try {
    result = await nightmare
      .goto(options.url)
      .wait(wait)
      .evaluate(() => document.body.innerHTML)
      .catch(handleNightmareError);
    this.logInfo(`end scrapeUrlForFullHtml`);
    result = replaceSubstrings(result, options.replacements);
    return result;
  } catch (err) {
    this.logError(`error while scrapeUrlForFullHtml: ${err}`);
    throw err;
  } finally {
    nightmare.end();
  }
};

sendResults = async (data, options) => {
  this.logInfo(`begin crawler request`);
  let url = config.apiUrl;
  let results = [];
  try {
    if (data instanceof Array) {
      for (let item of data) {
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

handleNightmareError = async error => {
  var err = new Error(
    'An error occurred internally while attempting to scrape using the context of a browser: ' +
      error.message
  );
  err.code = errorCodes.BrowserContextError;
  throw err;
};

isValidUrl = url => {
  const validUrlRegex = new RegExp(
    /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
    'gm'
  );
  return validUrlRegex.test(url);
};

exports.logInfo = (message, ...params) => {
  if (!config.isProduction) {
    if (params && params.length) {
      console.log(`[INFO] ${message}`, params);
    } else {
      console.log(`[INFO] ${message}`);
    }
  }
};

exports.logError = (message, ...params) => {
  if (!config.isProduction) {
    if (params && params.length) {
      console.error(`[ERROR] ${message}`, params);
    } else {
      console.error(`[ERROR] ${message}`);
    }
  }
};

exports.parseReplacements = replacements => {
  const response = [];
  let replacementsArray = [];
  if (Array.isArray(replacements)) {
    replacementsArray = replacements;
  } else if (replacements != null) {
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
