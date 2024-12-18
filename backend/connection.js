const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/restaurantDB';

module.exports.connect = function connect(app, port) {
    mongoose.connect(MONGO_URI)
    .then(() => {
        app.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
        });
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });
}