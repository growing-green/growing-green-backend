const express = require('express');
const router = express.Router();
const plantsController = require('../controllers/plants.controller');

router.get('/', plantsController.getAllPlantsById);
router.post('/new', plantsController.createNewPlant);
router.put('/:plantId', plantsController.updatePlant);
router.put('/', plantsController.updatePlantAll);
router.delete('/:plantId', plantsController.deletePlant);

module.exports = router;
