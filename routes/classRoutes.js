// routes/classRoutes.js
const express = require('express');
const router = express.Router();
const Class = require('../models/Class');

// Get all classes
router.get('/', async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

// Create a new class
router.post('/', async (req, res) => {
  const { name, schedule, instructor, availableSeats } = req.body;
  try {
    const newClass = new Class({ name, schedule, instructor, availableSeats });
    await newClass.save();
    res.status(201).json(newClass);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create class' });
  }
});


module.exports = router;
