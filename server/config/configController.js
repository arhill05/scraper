const logger = require('../utils/logger');
const configReader = require('./configReader');

exports.authenticate = async (req, res) => {
  const { password } = req.body;
  if (password == process.env.ADMIN_PASSWORD) {
    logger.logInfo('Authentication success');
    res.status(200).send();
  } else {
    logger.logInfo('Authentication fail');
    res.status(401).send();
  }
};

exports.getAllConfigs = async (req, res) => {
  try {
    const response = await configReader.readAllConfigs();
    res.json(response);
  } catch (err) {
    logger.logError('Error while retrieving config', err);
    res.status(500).send(err);
    throw err;
  }
};

exports.getConfig = async (req, res) => {
  try {
    const response = await configReader.readConfig(req.params.key);
    res.json(response);
  } catch (err) {
    logger.logError('Error while retrieving config', err);
    res.status(500).send(err);
    throw err;
  }
};

exports.getKeys = async (req, res) => {
  try {
    const response = await configReader.getConfigKeys();
    res.json(response);
  } catch (err) {
    logger.logError('Error while retrieving config keys', err);
    res.status(500).send(err);
    throw err;
  }
};

exports.updateConfig = async (req, res) => {
  try {
    const key = req.params.key;
    const isSuccessful = await configReader.updateConfig(key, req.body);
    if (isSuccessful) res.send('Successfully updated config');
  } catch (err) {
    logger.logError('Error while updating config', err);
    res.status(500).send(err);
    throw err;
  }
};

exports.createConfig = async (req, res) => {
  try {
    const key = req.params.key;
    console.log(req.body);
    const newConfig = await configReader.createConfig(key, req.body);
    res.json(newConfig);
  } catch (err) {
    logger.logError('Error while creating config', err);
    res.status(500).send(err);
    throw err;
  }
};

exports.deleteConfig = async (req, res) => {
  try {
    const key = req.params.key;
    const isSuccessful = await configReader.deleteConfig(key);
    if (isSuccessful) res.send('Successfully deleted config');
  } catch (err) {
    logger.logError('Error while deleting config', err);
    res.status(500).send(err);
    throw err;
  }
};
