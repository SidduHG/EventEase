const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();
const mongoose = require('mongoose');
const crypto = require('crypto'); // Added at top level
const User = require('../models/User'); 
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { verifyToken } = require('../middleware/verifyToken');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.post('/create-order', async (req, res) => {
  const { amount } = req.body;
  
  const options = {
    amount: amount * 100, // amount in paisa
    currency: 'INR',
    receipt: 'receipt_order_' + Math.floor(Math.random() * 100000),
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Order creation failed', details: err });
  }
});

router.post('/verify-payment',verifyToken, async (req, res) => {
  const userId=req.user.id;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const crypto = require('crypto');

  console.log('Verification request received:', { 
    razorpay_order_id, 
    razorpay_payment_id, 
    userId 
  }); // Add logging

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userId) {
    console.error('Missing fields in verification request');
    return res.status(400).json({ 
      success: false, 
      message: 'Missing payment or user data' 
    });
  }

  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const generated_signature = hmac.digest("hex");

  if (generated_signature === razorpay_signature) {
    try {
      console.log('Signature valid. Updating user:', userId);
      
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { verifiedOrganizer: true },
        { new: true }
      ).lean();

      if (!updatedUser) {
        console.error('User not found with ID:', userId);
        return res.status(404).json({ 
          success: false, 
          message: "User not found" 
        });
      }

      console.log('User updated successfully:', updatedUser);
      return res.status(200).json({ 
        success: true, 
        message: "Verified!", 
        user: updatedUser 
      });
    } catch (err) {
      console.error('Database update error:', err);
      return res.status(500).json({ 
        success: false, 
        message: "DB update failed", 
        error: err.message 
      });
    }
  } else {
    console.error('Invalid signature:', {
      received: razorpay_signature,
      generated: generated_signature
    });
    return res.status(400).json({ 
      success: false, 
      message: "Invalid signature. Verification failed." 
    });
  }
});

router.post('/create-event-order', verifyToken, async (req, res) => {
  try {
    // 1. Validate all required fields
    const required = ['eventId', 'ticketId', 'quantity', 'attendeeInfo'];
    for (const field of required) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: `Missing required field: ${field}`
        });
      }
    }

    // 2. Verify event and ticket exist
    const event = await Event.findById(req.body.eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const ticket = event.tickets.id(req.body.ticketId);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // 3. Create Razorpay order
    const amount = ticket.price * req.body.quantity * 100; // in paise
    const receipt = `evt-${Date.now()}`;
    const order = await razorpay.orders.create({
      amount: amount.toString(),
      currency: 'INR',
     receipt: receipt,
      notes: {
        eventId: req.body.eventId,
        ticketId: req.body.ticketId,
        userId: req.user.id // From verified token
      }
    });

    res.json({
      success: true,
      order,
      event: {
        name: event.name,
        description: event.description
      }
    });

  } catch (err) {
    console.error('Order creation error:', {
      error: err.error?.description || err.message,
      body: req.body
    });
    
    res.status(500).json({
      success: false,
      message: 'Order creation failed',
      error: err.error?.description || err.message
    });
  }
});


router.post('/verify-event-payment', verifyToken, async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      eventId,
      ticketId,
      quantity,
      attendeeInfo
    } = req.body;

    // Validate input
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || 
        !eventId || !ticketId || !quantity || !attendeeInfo) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields' 
      });
    }

    // Verify payment signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generated_signature = hmac.digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid payment signature' 
      });
    }

    // Check if payment was already processed
    const existingRegistration = await Registration.findOne({ 
      paymentIntentId: razorpay_payment_id 
    });
    
    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'Payment already processed'
      });
    }

    // Get event and ticket details
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ 
        success: false,
        message: 'Event not found' 
      });
    }

    const ticket = event.tickets.id(ticketId);
    if (!ticket) {
      return res.status(404).json({ 
        success: false,
        message: 'Ticket not found' 
      });
    }

    // Create registration
    const registration = new Registration({
      user: req.user.id,
      event: eventId,
      fullName: attendeeInfo.name,
      email: attendeeInfo.email,
      phone: attendeeInfo.phone,
      ticket: {
        ticketId: ticket._id,
        name: ticket.name,
        price: ticket.price
      },
      quantity,
      paymentStatus: 'paid',
      paymentIntentId: razorpay_payment_id
    });

    await registration.save();

    // Update ticket quantity if needed
    if (ticket.quantity) {
      ticket.quantity -= quantity;
      await event.save();
    }

    res.status(201).json({
      success: true,
      registration: {
        id: registration._id,
        event: event.name,
        ticket: ticket.name,
        quantity,
        totalAmount: ticket.price * quantity
      }
    });

  } catch (error) {
    console.error('Verification failed:', {
      error: error.message,
      body: req.body,
      user: req.user?.id
    });
    
    res.status(500).json({
      success: false,
      message: error.message || 'Payment verification failed'
    });
  }
});

module.exports = router;