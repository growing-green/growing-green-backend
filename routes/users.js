const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');

router.post('/login', usersController.getLoginOrSingUp);
router.get('/auth', usersController.getAuth);

module.exports = router;
