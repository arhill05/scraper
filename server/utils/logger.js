const configReader = require('../config/configReader');
let config = configReader.readConfigSync();

exports.logInfo = (message, ...params) => {
  if (!process.env.IS_PRODUCTION) {
    if (params && params.length) {
      console.log(`[INFO] ${message}`, params);
    } else {
      console.log(`[INFO] ${message}`);
    }
  }
};

exports.logError = (message, ...params) => {
  if (!process.env.IS_PRODUCTION) {
    if (params && params.length) {
      console.error(`[ERROR] ${message}`, params);
    } else {
      console.error(`[ERROR] ${message}`);
    }
  }
};
