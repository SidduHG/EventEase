const express=require('express');
const router=express.Router();
const {verifyToken}=require('../middleware/verifyToken')
const User = require('../models/User'); 

router.get('/me', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // 👈 From token

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
      }
    });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/user', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      verifiedOrganizer: user.verifiedOrganizer,
      // Add any other fields you need
    });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


module.exports = router;