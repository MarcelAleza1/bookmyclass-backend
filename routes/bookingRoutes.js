// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().populate({
      path: 'user',
      select: '_id firstname lastname email',
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Create a new booking
router.post('/', async (req, res) => {
  const { userId, classId } = req.body;
  try {
    const newBooking = new Booking({ user: userId, class: classId });
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
});


module.exports = router;
