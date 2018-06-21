const logger = require('../utils/logger');
const configReader = require('./configReader');

exports.getConfig = async (req, res) => {
  try {
    const response = await configReader.readConfig();
    res.json(response);
  } catch (err) {
    logger.logError('Error while retrieving config', err);
    throw err;
  }
};

exports.updateConfig = async (req, res) => {
  try {
    console.log(req.body);
    const isUpdateSuccessful = await configReader.updateConfig(req.body);
    if (isUpdateSuccessful) {
      res.send('Successfully updated config');
    }
  } catch (err) {
    logger.logError('Error while updating config', err);
    throw err;
  }
};
