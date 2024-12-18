const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    destination: {
      type: String,
      required: true
    },
    payment_method: {
      type: String,
      required: true,
      lowercase: true
    },
    status: {
      type: String,
      required: true
    },
    details: {
      type: [String],
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
});
module.exports.Order = mongoose.model('Order', orderSchema);