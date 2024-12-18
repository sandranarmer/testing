const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    customer_id: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 10, 
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Export the Feedback model
module.exports.Feedback = mongoose.model('Feedback', feedbackSchema);
