const Nightmare = require('nightmare');
const configReader = require('../config/configReader');
const axios = require('axios');
const errorCodes = require('../errorCodes');
const logger = require('../utils/logger');
const qs = require('querystring');
let _config = null;

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
  const key = options.configKey ? options.configKey : null;
  _config = await configReader.readConfig(key);
  if (!_config) {
    var err = new Error('Invalid config key');
    err.code = errorCodes.UnknownConfig;
    throw err;
  }

  const nightmare = constructNightmareInstance();
  let wait = options.waitTime ? Number(options.waitTime) : 1000;
  let result = null;
  logger.logInfo(`begin scrape`);
  logger.logInfo(`scraping ${options.url} for xpath ${options.xpath}`);
  try {
    result = await nightmare
      .goto(options.url)
      .wait(wait)
      .evaluate(xpath => {
        var result = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
        var node,
          nodes = [];
        while ((node = result.iterateNext())) nodes.push(node.nodeValue);
        return nodes;
      }, options.xpath)
      .catch(handleNightmareError);

    logger.logInfo(`end scrape`);
    await sendResults(result, options);
    return result;
  } catch (err) {
    logger.logError(`error while scraping: ${err}`);
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

  const key = options.configKey ? options.configKey : null;
  _config = await configReader.readConfig(key);

  if (!_config) {
    var err = new Error('Invalid config key');
    err.code = errorCodes.UnknownConfig;
    throw err;
  }

  let result = null;
  logger.logInfo(`begin scrapeUrlForFullHtml`);
  const nightmare = constructNightmareInstance();
  try {
    if (_config.useAuth === 'true') {
      result = await scrapeHtmlWithNightmareLogin(nightmare, options);
    } else {
      result = await scrapeHtml(nightmare, options);
    }
    logger.logInfo(`end scrapeUrlForFullHtml`);
    await sendResults(result.autoEnqueue, options);
    result = replaceSubstrings(result, options.replacements);
    return result.html;
  } catch (err) {
    logger.logError(`error while scrapeUrlForFullHtml: ${err}`);
    throw err;
  } finally {
    nightmare.end();
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

scrapeHtmlWithNightmareLogin = async (nightmareInstance, options) => {
  logger.logInfo('emulating login before scraping');
  const wait = options.waitTime ? Number(options.waitTime) : 1000;
  const result = await nightmareInstance
    .goto(_config.loginUrl)
    .wait(_config.usernameFieldSelector)
    .type(_config.usernameFieldSelector, _config.siteUsername)
    .type(_config.passwordFieldSelector, _config.sitePassword)
    .click(_config.submitInputSelector)
    .wait(500)
    .goto(options.url)
    .wait(wait)
    .evaluate(autoEnqueueTypes => {
      let autoEnqueue = [];
      autoEnqueueTypes.forEach(type => {
        const xpath = `//a[contains(@href, "${type}")]`;
        const result = document.evaluate(
          xpath,
          document,
          null,
          XPathResult.ANY_TYPE,
          null
        );
        while ((node = result.iterateNext())) {
          if (node.href) {
            autoEnqueue.push(node.href);
          }
        }
      });
      const result = { html: document.body.innerHTML, autoEnqueue };
      return result;
    }, _config.autoEnqueueTypes != null ? _config.autoEnqueueTypes.split(',') : [])
    .end()
    .catch(handleNightmareError);

  return result;
};

scrapeHtml = async (nightmareInstance, options) => {
  const wait = options.waitTime ? Number(options.waitTime) : 1000;
  const result = await nightmareInstance
    .goto(options.url)
    .wait(wait)
    .evaluate(autoEnqueueTypes => {
      let autoEnqueue = [];
      autoEnqueueTypes.forEach(type => {
        const xpath = `//a[contains(@href, "${type}")]`;
        const result = document.evaluate(
          xpath,
          document,
          null,
          XPathResult.ANY_TYPE,
          null
        );
        while ((node = result.iterateNext())) {
          if (node.href) {
            autoEnqueue.push(node.href);
          }
        }
      });
      const result = { html: document.body.innerHTML, autoEnqueue };
      return result;
    }, _config.autoEnqueueTypes != null ? _config.autoEnqueueTypes.split(',') : [])
    .end()
    .catch(handleNightmareError);

  return result;
};

getCookies = async (apiUrl, username, password) => {
  let result = await Nightmare({ show: true, typeInterval: 5 })
    .goto(apiUrl)
    .wait('#auth')
    .type('#auth', username)
    .type('#password', password)
    .click('#elSignIn_submit')
    .wait(2000)
    .cookies.get()
    .end()
    .then(cookies => cookies);

  result = result.map(x => {
    return {
      name: x.name,
      value: x.value,
      domain: x.domain,
      httpOnly: x.httpOnly,
      expirationDate: x.expirationDate,
      secure: x.secure,
      path: x.path
    };
  });
  return result;
};

sendResults = async (data, options) => {
  logger.logInfo(`begin crawler request`);
  let url = _config.apiUrl;
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
      const response = await axios.get(itemUrl);
      results.push(response.data);
    }
  } catch (err) {
    logger.logError(`error while scraping: ${err}`);
    throw err;
  }
  logger.logInfo(`end crawler request`);
  return results;
};

enqueueFiles = async data => {
  logger.logInfo(`begin autoEnqueueAttempt`);
};

constructUrl = (url, item, options) => {
  item = replaceSubstrings(item, options.replacements);
  let resultUrl = `${url}?url=${encodeURIComponent(item)}`;
  resultUrl += `&v.username=${_config.username}&v.password=${
    _config.password
  }&v.indent=true&v.app=api-rest`;
  resultUrl += `&collection=${
    _config.collection ? _config.collection : 'example-metadata'
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
      error.message + ':' + error.details
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

replaceSubstrings = (item, replacements) => {
  if (replacements && replacements.length) {
    replacements.forEach(r => {
      item = item.replace(new RegExp(r.replaceThis, 'g'), r.withThis);
    });
  }
  return item;
};

constructNightmareInstance = () => {
  let options = {
    show: false,
    typeInterval: 1
  };

  if(_config.proxyServer) {
    options.switches = {
      'proxy-server': _config.proxyServer
    }
  }

  if (_config.proxyUsername && _config.proxyPassword) {
    return Nightmare(options).authentication(_config.proxyUsername, _config.proxyPassword);
  }
  else {
    return Nightmare(options);
  }
}
