const express = require('express');
const router = express.Router();
const configController = require('../config/configController');

router.get('/', configController.getAllConfigs)
router.get('/keys', configController.getKeys);
router.get('/:key', configController.getConfig);
router.post('/key', configController.createConfig);
router.put('/:key', configController.updateConfig);
router.delete('/:key', configController.deleteConfig);

module.exports = router;