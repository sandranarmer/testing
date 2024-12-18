const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  extra_property: {
    type: String,
    required: true // e.g., "Size" for beverages, "Calories" for desserts
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports.Menu = mongoose.model('Menu', menuSchema);