
const Feedback = require('./feedback.schema');

exports.addFeedback = async (data) => {
    console.log('Received data:', data); // Log the received data

    const feedback = new Feedback(data); // Create feedback instance
    console.log('Created feedback instance:', feedback); // Log the feedback instance

    try {
        const savedFeedback = await feedback.save(); // Save feedback to DB
        console.log('Saved feedback:', savedFeedback); // Log saved feedback
        return savedFeedback;
    } catch (error) {
        console.error('Error saving feedback:', error); // Log error if any
        throw error;
    }
};
exports.getAllFeedback = async () => {
    try {
        const feedback = await Feedback.find();
        console.log('Retrieved feedback:', feedback); // Log the retrieved feedback
        return feedback;
    } catch (error) {
        console.error('Error retrieving feedback:', error);
        throw error;
    }
};
exports.getFeedbackByCustomer = async (customerId) => {
    try {
        const feedback = await Feedback.find({ customerId });
        console.log('Retrieved feedback for customer:', feedback); // Log the retrieved feedback
        return feedback;
    } catch (error) {
        console.error('Error retrieving feedback for customer:', error);
        throw error;
    }
};
