const express = require('express');
const router = express.Router();
const userController = require('../controllers/weatherController');


router.get('/weather', userController.weather);
router.get('/', userController.weather);


module.exports = router;
