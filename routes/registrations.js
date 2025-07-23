const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { verifyToken } = require('../middleware/verifyToken');
const Razorpay = require('razorpay');

// Free Events Only - Registration Route
router.post('/', verifyToken, async (req, res) => {
  try {
    const { event, fullName, email, phone } = req.body;
    const userId = req.user.id;

    // Validate event exists
    const eventData = await Event.findById(event);
    if (!eventData) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Allow only free events
    if (eventData.registrationType !== 'free') {
      return res.status(400).json({ message: 'Only free event registrations are allowed here' });
    }

    // Check for existing registration
    const existingRegistration = await Registration.findOne({ user: userId, event });
    if (existingRegistration) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }

    // Create registration
    const registration = new Registration({
      user: userId,
      event,
      fullName,
      email,
      phone,
      quantity: 1,
      paymentStatus: 'free'
    });

    await registration.save();

    // Update event attendees count
    await Event.findByIdAndUpdate(event, { $inc: { attendeesCount: 1 } });

    res.status(201).json({
      message: 'Registration successful',
      registration
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

router.get('/registered-events', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all registrations of the logged-in user
    const registrations = await Registration.find({ user: userId }).populate('event');

    // Extract events from the registrations
    const events = registrations.map(registration => {
      const event = registration.event;
      return {
        _id: event._id,
        name: event.name,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
        location: event.location,
        registrationType: event.registrationType
      };
    });

    res.status(200).json(events);
  } catch (err) {
    console.error('Error fetching registered events:', err);
    res.status(500).json({ message: 'Server error while fetching registered events' });
  }
});

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// Paid Events - Create Order Route
router.post('/create-order', verifyToken, async (req, res) => {
  try {
    const { event, quantity } = req.body;
    const userId = req.user.id;

    // Validate event exists and is paid
    const eventData = await Event.findById(event);
    if (!eventData) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (eventData.registrationType !== 'paid') {
      return res.status(400).json({ message: 'This is not a paid event' });
    }

    // Check ticket availability
    if (eventData.tickets.length === 0) {
      return res.status(400).json({ message: 'No tickets available for this event' });
    }

    // Check for existing registration
    const existingRegistration = await Registration.findOne({ user: userId, event });
    if (existingRegistration) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }

    // Calculate amount (using the first ticket price)
    const ticketPrice = eventData.tickets[0].price;
    const amount = ticketPrice * quantity * 100; // Convert to paise

    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        eventId: event,
        userId: userId,
        quantity: quantity
      }
    });

    res.status(200).json({ 
      order,
      eventName: eventData.name,
      eventDescription: eventData.description
    });

  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ 
      message: 'Order creation failed',
      error: err.error ? err.error.description : err.message 
    });
  }
});

// Paid Events - Verify Payment Route
router.post('/verify-payment', verifyToken, async (req, res) => {
  try {
    const { event, fullName, email, phone, quantity, orderId, paymentId, signature } = req.body;
    const userId = req.user.id;

    // Validate event
    const eventData = await Event.findById(event);
    if (!eventData) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Verify payment signature
    const crypto = require('crypto');
    const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(orderId + "|" + paymentId)
      .digest('hex');

    if (generatedSignature !== signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Create registration
    const registration = new Registration({
      user: userId,
      event,
      fullName,
      email,
      phone,
      quantity,
      paymentStatus: 'paid',
      paymentAmount: eventData.tickets[0].price * quantity,
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: signature
    });

    await registration.save();
    
    // Update event attendees count
    await Event.findByIdAndUpdate(event, { 
      $inc: { attendeesCount: quantity } 
    });

    res.status(201).json({ 
      message: 'Payment verified and registration successful', 
      registration 
    });

  } catch (err) {
    console.error('Payment verification error:', err);
    res.status(500).json({ 
      message: 'Payment verification failed',
      error: err.message 
    });
  }
});


module.exports = router;


