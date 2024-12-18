const { Feedback } = require('./feedback.schema');

module.exports.FeedbackRepository = {
    async findAll() {
        return await Feedback.find();
    },
    async findByCustomerId(customerId) {
        return await Feedback.find({ customer_id: customerId });
    },
    async create(feedbackData) {
        const newFeedback = new Feedback(feedbackData);
        return await newFeedback.save();
    },
    async deleteById(feedbackId) {
        return await Feedback.findByIdAndDelete(feedbackId);
    },
};