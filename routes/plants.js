const express = require('express');
const router = express.Router();
const plantsController = require('../controllers/plants.controller');

router.get('/', plantsController.getAllPlantsById);
router.post('/new', plantsController.createNewPlant);
router.put('/:id', plantsController.updatePlant);

module.exports = router;
