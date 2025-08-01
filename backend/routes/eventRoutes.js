const express = require('express');
const mongoose =require('mongoose')
const Event = require('../models/Event');
const { verifyToken } = require('../middleware/verifyToken');
const Registration = require('../models/Registration');
const router = express.Router();

// Create Event
router.post('/free-event', verifyToken, async (req, res) => {
  try {
    // Force registrationType to 'free'
    const eventData = {
      ...req.body,
      registrationType: 'free',
      organizer: req.user.id,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
      tickets: [] // No tickets for free events
    };

    // Create and save event
    const event = new Event(eventData);
    await event.save();

    res.status(201).json(event);
  } catch (err) {
    console.error('Free event creation error:', {
      error: err.message,
      validationErrors: err.errors,
      requestBody: req.body
    });

    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation failed',
        errors: Object.values(err.errors).map(e => e.message)
      });
    }

    res.status(500).json({
      message: 'Failed to create free event',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});
// Create Event
router.post('/', verifyToken, async (req, res) => {
  try {
    // Normalize and validate registrationType first
    const registrationType = req.body.registrationType?.toLowerCase()?.trim();
    if (!['free', 'paid'].includes(registrationType)) {
      return res.status(400).json({ 
        message: 'Invalid registration type. Must be either "free" or "paid"' 
      });
    }

    // Prepare event data
    const eventData = {
      ...req.body,
      registrationType,
      organizer: req.user.id,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
      tickets: registrationType === 'paid' ? req.body.tickets : []
    };

    // Create and save event
    const event = new Event(eventData);
    await event.save();

    res.status(201).json(event);
  } catch (err) {
    console.error('Event creation error:', {
      error: err.message,
      validationErrors: err.errors,
      requestBody: req.body
    });

    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation failed',
        errors: Object.values(err.errors).map(e => e.message)
      });
    }

    res.status(500).json({ 
      message: 'Failed to create event',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});


// Get All Events (future events, sorted by closest first)
router.get('/', async (req, res) => {
  try {
    const now = new Date();
    const events = await Event.find({ startDate: { $gte: now } }).sort({ startDate: 1 });

    res.status(200).json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch events' });
  }
});


router.get('/my-events', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
   // Only fetch events where user is the organizer
    const events = await Event.find({ organizer: userId }).sort({ startDate: 1 }).lean();

    // Get events user is registered for by querying Registration collection
    const registeredEvents = await Registration.find({ user: userId }).select('event').lean();
    const registeredEventIds = registeredEvents.map(r => r.event.toString());

    const eventIdsSet = new Set(events.map(e => e._id.toString()));
    registeredEventIds.forEach(id => eventIdsSet.add(id));

  // Fetch all relevant events again using IDs (to avoid duplicates)
    const allEvents = await Event.find({ _id: { $in: Array.from(eventIdsSet) } }).lean();

    // For each event, count how many registrations it has
    const eventsWithCounts = await Promise.all(events.map(async (event) => {
      const registeredCount = await Registration.countDocuments({ event: event._id });
      return {
        ...event,
        registeredCount
      };
    }));
    res.status(200).json(eventsWithCounts);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch user events' });
  }
});



//get event by id 
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Event ID' });
    }

    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email'); // Optional: populate organizer info

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.status(200).json(event);
  } catch (err) {
    console.error('Error fetching event:', err);
    res.status(500).json({ message: 'Failed to fetch event details' });
  }
});



// Delete Event (only by organizer)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete event' });
  }
});

router.get('/:eventId/ticket', verifyToken, async (req, res) => {
  try {
    const registration = await Registration.findOne({
      event: req.params.eventId,
      user: req.user.id
    }).populate('event user');
    
    if (!registration) {
      return res.status(404).json({ message: 'No ticket found for this event' });
    }
    
    res.json(registration);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching ticket' });
  }
});

router.post('/verify-ticket', verifyToken, async (req, res) => {
  try {
    const { qrData, eventId } = req.body;
    const data = JSON.parse(qrData);
    
    // Verify all required fields exist
    if (!data.eventId || !data.userId || !data.registrationId) {
      return res.json({ valid: false, message: 'Invalid ticket data' });
    }
    
    // Check if registration exists
    const registration = await Registration.findOne({
      _id: data.registrationId,
      event: data.eventId,
      user: data.userId
    });
    
    if (!registration) {
      return res.json({ valid: false, message: 'Ticket not found in system' });
    }
    
    // Additional checks (event exists, not cancelled, etc.)
    const event = await Event.findById(data.eventId);
    if (!event) {
      return res.json({ valid: false, message: 'Event not found' });
    }
    
    res.json({ 
      valid: true, 
      message: 'Ticket is valid',
      user: registration.user,
      event: registration.event
    });
  } catch (err) {
    res.json({ valid: false, message: 'Verification failed' });
  }
});


module.exports = router;