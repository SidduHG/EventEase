const express=require('express')
const router=express.Router();
const Event=require('../models/Event')
const Registration=require('../models/Registration');

router.get('/stats',async (req,res)=>{
    try{
        const now=new Date();
       const totalEvents=await Event.countDocuments({});
       const activeEvents=await Event.countDocuments({
        startDate:{$lte:now},
        endDate:{$gte:now}
       });

        const registrations = await Registration.find({}, 'quantity');
        const totalAttendees = registrations.reduce((sum, reg) => {
        return sum + (reg.quantity || 0);
        }, 0);

        res.json({
            totalEvents,
            activeEvents,
            totalAttendees
        })
    }catch(err){
         console.error('Error fetching stats:', err);
         res.status(500).json({ error: 'Failed to fetch stats' });
    }
})



router.get('/recent-events',async(req,res)=>{
     try{
        const now=new Date();
        const recentEvents=await Event.find({endDate:{$lt:now}});
        return res.json({recentEvents});
     }catch(err){
        console.log(err);
     }
})

router.get('/filter', async (req, res) => {
  const { type, time } = req.query;

  if (!type || !time) {
    return res.status(400).json({ message: 'Missing type or time query parameter' });
  }

  try {
    const now = new Date();

    // Build query conditions based on time filter
    let timeCondition = {};
    if (time === 'upcoming') {
      timeCondition = { startDate: { $gte: now } };
    } else if (time === 'past') {
      timeCondition = { endDate: { $lt: now } };
    } else if (time === 'current') {
      // event is ongoing right now
      timeCondition = { startDate: { $lte: now }, endDate: { $gte: now } };
    } else {
      return res.status(400).json({ message: 'Invalid time filter' });
    }

    // Query events by type and time condition
    const events = await Event.find({ 
      type: type.toLowerCase(),
      ...timeCondition
    }).sort({ startDate: 1 }); // sort ascending by start date

    res.json(events);
  } catch (error) {
    console.error('Error fetching filtered events:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET event details with admin view
router.get('/event-details/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId).lean();
    const registrations = await Registration.find({ event: eventId }, 'quantity').lean();
    const registrationCount = registrations.reduce((sum, reg) => sum + (reg.quantity || 0), 0);

    if (!event) return res.status(404).json({ message: 'Event not found' });

    const now = new Date();
    let status = '';

    if (new Date(event.endDate) < now) {
      status = 'past';
    } else if (new Date(event.startDate) > now) {
      status = 'upcoming';
    } else {
      status = 'current';
    }

    const response = {
      ...event,
      status,
      registrationCount
    };

    if (status === 'past' || status === 'current') {
        const attendees = await Registration.find({ event: eventId });
        const attendeeCount = attendees.reduce((sum, reg) => sum + (reg.quantity || 0), 0);

    response.attendeeCount = attendeeCount;

    if (status === 'past') {
        const revenue = attendees.reduce((total, reg) => {
        return total + ((reg.ticket?.price || 0) * (reg.quantity || 1));
        }, 0);
        response.revenueGenerated = revenue;
    }
    }


    return res.json(response);
  } catch (error) {
    console.error('Error fetching event details:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports=router;