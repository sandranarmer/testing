const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  table_capacity: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'], 
    default: 'Pending',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports.Reservation = mongoose.model('Reservation', reservationSchema);