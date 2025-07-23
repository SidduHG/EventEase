const express = require('express');
const Contact = require('../models/Contact');
const router = express.Router();

router.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    console.log(req.body);

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    res.status(201).json({ success: true, message: 'Message sent successfully' });
  } catch (err) {
    console.error("Error saving contact:", err); 
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
});

module.exports = router;
