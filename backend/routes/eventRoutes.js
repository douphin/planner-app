const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.post('/', eventController.createEvent);
router.post('/add', eventController.addEvent);

router.get('/fetchEvents/:user_id', eventController.getEvents);
router.get('/fetchAll', eventController.getAllEvents);

router.put('/update/:id', eventController.updateEvent); 

router.delete('/del/:id', eventController.deleteEvent); 
router.delete('/empty/:user_id', eventController.emptyEvents); 
router.delete('/deleteAll', eventController.deleteAll); 

module.exports = router;
