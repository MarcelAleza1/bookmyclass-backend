const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  schedule: {
    type: String,
    required: true,
  },
  instructor: {
    type: String,
    required: true,
  },
  availableSeats: {
    type: Number,
    required: true,
  },
});

const Class = mongoose.model('Class', classSchema);

module.exports = Class;
