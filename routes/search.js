const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controller');

router.get('/', searchController.crawlPlantNames);
router.get('/:number', searchController.crawlPlantInfo);

module.exports = router;
