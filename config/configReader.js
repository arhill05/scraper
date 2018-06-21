const jsonfile = require('jsonfile');
const file = __dirname + '/config.json';
const util = require('util');
const logger = require('../utils/logger');

const readFile = util.promisify(jsonfile.readFile);
const writeFile = util.promisify(jsonfile.writeFile);

exports.readConfig = async () => {
  try {
  const config = await readFile(file);
  return config;
  } catch (err) {
    logger.logError('Error while reading config', err);
    throw err;
  }
};

exports.updateConfig = async updatedConfig => {
  try {
    if (updatedConfig) {
      await writeFile(__dirname + '/config.json', updatedConfig);
    }
  } catch (err) {
    logger.logError('Error while updating config', err);
    throw err;
  }

  return true;
};

exports.readConfigSync = () => {
  return jsonfile.readFileSync(file);
}
