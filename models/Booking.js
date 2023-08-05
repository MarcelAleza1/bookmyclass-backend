// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
