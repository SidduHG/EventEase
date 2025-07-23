// adminAnalyticsRoutes.js
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const User = require('../models/User');
// const Feedback = require('../models/Feedback');
const Contact=require('../models/Contact')
const mongoose = require('mongoose');

// 1. Get event type distribution
router.get('/event-type-stats', async (req, res) => {
  try {
    const results = await Event.aggregate([
      { $group: { _id: '$type', value: { $sum: 1 } } },
      { $project: { _id: 0, type: '$_id', value: 1 } }
    ]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 2. Get user signups per day (last 30 days)
router.get('/user-signups', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const results = await User.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: '$_id', count: 1 } }
    ]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/top-organizers', async (req, res) => {
  try {
    const results = await Event.aggregate([
      {
        $group: {
          _id: '$organizer',
          events: { $sum: 1 }
        }
      },
      {
        $sort: { events: -1 }
      },
      {
        $limit: 10
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'organizer'
        }
      },
      {
        $unwind: '$organizer'
      },
      {
        $project: {
          _id: 0,
          name: '$organizer.name',
          profileImage: '$organizer.profileImage',
          events: 1
        }
      }
    ]);

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


// 4. Event stats (this week/month/year)
router.get('/event-stats', async (req, res) => {
  try {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [week, month, year] = await Promise.all([
      Event.countDocuments({ createdAt: { $gte: startOfWeek } }),
      Event.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Event.countDocuments({ createdAt: { $gte: startOfYear } }),
    ]);

    res.json({ week, month, year });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// // 5. Recent feedback
// router.get('/feedbacks', async (req, res) => {
//   try {
//     const feedbacks = await Feedback.find()
//       .sort({ createdAt: -1 })
//       .limit(10)
//       .select('event text');

//     res.json(feedbacks);
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

router.get('/contact', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json(contacts);
  } catch (err) {
    console.error('Error fetching contacts:', err);
    res.status(500).json({ message: 'Failed to fetch contact queries.' });
  }
});


module.exports = router;
