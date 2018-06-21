const configReader = require('../config/configReader');
const config = configReader.readConfigSync();

module.exports = (req, res, next) => {
  const apiKey = config.apiKey;
  const header = req.get('X-Access-Key');
  if (!header || header != apiKey) {
    res.status(401).send('Unauthorized');
  } else {
    next();
  }
};
