const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.post('/create', eventController.createEvent);
router.post('/add', eventController.addEvent);

router.get('/:user_id', eventController.getEvents);
router.get('/all', eventController.getAllEvents);

router.put('/:id', eventController.updateEvent); 

router.delete('/empty/:user_id', eventController.emptyEvents); 
router.delete('/all', eventController.deleteAll); 

module.exports = router;
