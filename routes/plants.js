const express = require('express');
const router = express.Router();
const plantsController = require('../controllers/plants.controller');

router.get('/', plantsController.getAllPlants);
router.post('/new', plantsController.createNewPlant);
router.put('/:plantId', plantsController.updatePlant);

module.exports = router;
