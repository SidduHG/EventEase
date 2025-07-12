// routes/ticketVerification.js
const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Event = require('../models/Event'); // Make sure this is your event model
const User = require('../models/User'); // Organizer/User model
const { verifyToken } = require('../middleware/verifyToken');

// Verify QR Ticket
router.post('/verify-ticket', verifyToken, async (req, res) => {
  try {
    const { ticketId, eventId } = req.body;

    const registration = await Registration.findOne({
      'ticket.ticketId': ticketId,
      event: eventId
    }).populate('event user');

    if (!registration) {
      return res.status(404).json({ valid: false, message: 'Ticket is not valid for this event.' });
    }

    // Get organizer name
    const organizer = await User.findById(registration.event.organizer);

    res.status(200).json({
      valid: true,
      message: 'Ticket verified successfully.',
      data: {
        eventName: registration.event.name,
        organizerName: organizer ? organizer.fullName : 'Organizer',
        userName: registration.fullName,
        ticketQuantity: registration.ticket.quantity,
      }
    });
  } catch (err) {
    console.error('Ticket verification error:', err);
    res.status(500).json({ valid: false, message: 'Server error during verification.' });
  }
});

module.exports = router;
