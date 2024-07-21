const { Event } = require('../models');

exports.createEvent = async (req, res) => {
    const { user_id, name, description, start_time, end_time, status } = req.body;
    try {
        const event = await Event.create({
            user_id,
            name, 
            description, 
            start_time, 
            end_time, 
            status
        });

        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateEvent = async (req, res) => {
    const eventId = req.params.id; 
    const { user_id, name, description, start_time, end_time, status } = req.body;
    
    try {
      const event = await Event.findByPk(eventId);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
      await event.update({ 
        user_id, 
        name, 
        description, 
        start_time, 
        end_time, 
        status 
      });
  
      res.status(200).json(event); 
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

exports.getEvent = async (req, res) => {
    try {
        const events = await Event.findAll();
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
