const { Event } = require('../models');

// ==================== CREATE ==================== //

// --- CREATE event 
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
        console.error("Error creating event: ", error);
        res.status(500).json({ error: error.message });
    }
};

// --- CREATE new event or update existing event for user_id
exports.addEvent = async (req, res) => {
    const { user_id, name, description, start_time, end_time, status }  = req.body;
    try {
        const existingEvent = await Event.findOne({ where: { user_id, name, description, start_time, end_time, status } });

        if (existingEvent) {
            // update if the event already exists
            await existingEvent.update( { user_id, name, description, start_time, end_time, status } );
            res.json(existingEvent);
        } else {
            // create a new event
            const newEvent = await Event.create( { user_id, name, description, start_time, end_time, status } );
            res.status(201).json(newEvent);
        }
    } catch (error) {
        console.error("Error adding / editing event: ", error);
        res.status(500).json({ error: error.message });
    }
};

// ==================== UPDATE ==================== //

// --- UPDATE event by event id
exports.updateEvent = async (req, res) => {
    const eventId = req.params.id; 
    const { user_id, name, description, start_time, end_time, status } = req.body;
    
    try {
        // find by event id
        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ error: 'event not found' });
        }
        await event.update( { user_id, name, description, start_time, end_time, status } );
    
          res.status(200).json(event); 
    } catch (error) {
        console.error("Error updating event: ", error);
        res.status(500).json({ error: error.message });
    }
};

// ==================== GET ==================== //

// --- GET event items for user
exports.getEvents = async (req, res) => {
  const userId = req.params.user_id;
  try {
      const event_items = await Event.findAll({ where: { user_id: userId } });

      res.json(event_items);
  } catch (error) {
      console.error("Error fetching events: ", error);
      res.status(500).json({ error: error.message });
  }
};


// --- GET all events
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.findAll();
        res.json(events);
    } catch (error) {
        console.error("Error fetching all events: ", error);
        res.status(500).json({ error: error.message });
    }
};


// ==================== DELETE ==================== //

// --- DELETE all events for user
exports.emptyEvents = async (req, res) => {
    try {
        // find all events for useer
        const event_items = await Event.findAll({ where: { user_id } });
        await Event.destroy({ where: { user_id } })

        res.json(event_items);
    } catch (error) {
        console.error("Error deleting user events: ", error);
        res.status(500).json({ error: error.message });
    }
};

// --- DELETE all events
exports.deleteAllEvents = async (req, res) => {
    try {
        await Event.destroy({ where: {} })

        res.json( { message: "all events deleted" } );
    } catch (error) {
        console.error("Error deleting events:", error);
        res.status(500).json({ error: error.message });
    }
}
