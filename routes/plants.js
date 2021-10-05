const express = require('express');
const router = express.Router();
const plantsController = require('../controllers/users.controller');

router.get('/', plantsController.getAllPlants);

module.exports = router;
