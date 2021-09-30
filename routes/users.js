const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');

router.get('/login', usersController.getLoginOrSingUp);
router.get('/auth', usersController.getAuth);

module.exports = router;
