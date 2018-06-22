const jsonfile = require('jsonfile');
const path = require('path');
const storage = require('node-persist');
storage.init({
  dir: path.join(__dirname, '/data/')
});
const file = __dirname + '/config.json';
const util = require('util');
const logger = require('../utils/logger');

const writeFile = util.promisify(jsonfile.writeFile);

exports.readAllConfigs = async () => {
  try {
    const configs = await storage.values();
    return configs;
  } catch (err) {
    logger.logError('Error while reading config', err);
    throw err;
  }
}

exports.readConfig = async key => {
  try {
    const config = await storage.getItem(!key ? 'default' : key);
    return config;
  } catch (err) {
    logger.logError('Error while reading config', err);
    throw err;
  }
};

exports.getConfigKeys = async () => {
  try {
    const keys = await storage.keys();
    return keys;
  } catch (err) {
    logger.logError('Error while reading config keys', err);
    throw err;
  }
};

exports.createConfig = async (key, newConfig) => {
  try {
    await storage.setItem(key, newConfig);
    const newConfig = await storage.getItem(key);
    return newConfig;
  } catch (err) {
    logger.logError('Error while updating config', err);
    throw err;
  }
};

exports.updateConfig = async (key, updatedConfig) => {
  try {
    if (updatedConfig) {
      await storage.setItem(key, updatedConfig);
      return true;
    }
  } catch (err) {
    logger.logError('Error while updating config', err);
    throw err;
  }
};

exports.deleteConfig = async key => {
  try {
    await storage.removeItem(key);
    return true;
  } catch (err) {
    logger.logError('Error while updating config', err);
    throw err;
  }
};

exports.readConfigSync = () => {
  return jsonfile.readFileSync(file);
};

seedDefault = async () => {
  let defaultConfig = await storage.getItem('default');

  if (!defaultConfig) {
    defaultConfig = {
      apiUrl: 'http://demo10.yippyhub.com/ysa/cgi-bin/test',
      username: 'ahill',
      password: 'password'
    };

    await storage.setItem('default', defaultConfig);
  }
};

seedDefault();
