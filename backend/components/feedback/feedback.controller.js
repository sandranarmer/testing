const { FeedbackService } = require('./feedback.service');

module.exports.Init_Feedback = (app) => {
    app.post('/feedback', async (req, res) => {
        try {
            const feedback = await FeedbackService.createFeedback(req.body);
            res.status(201).json(feedback);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    app.get('/feedback', async (req, res) => {
        try {
            const feedback = await FeedbackService.getAllFeedback();
            res.status(200).json(feedback);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.get('/feedback/customer/:customer_id', async (req, res) => {
        try {
            const feedback = await FeedbackService.getFeedbackByCustomerId(req.params.customer_id);
            if (!feedback.length) {
                return res.status(404).json({ message: 'No feedback found for this customer.' });
            }
            res.status(200).json(feedback);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.delete('/feedback/:feedback_id', async (req, res) => {
        try {
            const deletedFeedback = await FeedbackService.deleteFeedback(req.params.feedback_id);
            res.status(200).json({ message: 'Feedback deleted successfully.' });
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    });
};