const express = require('express');
const router = express.Router();
const plantsController = require('../controllers/plants.controller');

router.get('/', plantsController.getAllPlants);

module.exports = router;
