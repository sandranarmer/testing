const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone_num: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['admin', 'customer'], 
            required: true,
        },
        address: {
            type: String,
            required: function() {
                return this.role === 'customer';
            },
        },
        cart: {
            type: [{
                item_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true },
                quantity: { type: Number, required: true, default: 1 }
            }],
            default: [],
            required: function() {
                return this.role === 'customer';
            }
        }
    },
    { timestamps: true }
);

// Export the User model
module.exports.User = mongoose.model('User', userSchema);