// Repository: Handles database interactions
const { User } = require('./user.schema');
const { Menu } = require('../menu/menu.schema');

module.exports.UserRepository = {
    // declarative
    async findAll() {
        return await User.find();
    },
    async findById(userId) {
        return await User.findById(userId);
    },
    async findByEmail(email) {
        return await User.findOne({ email });
    },
    async findByRole(role) {
        return await User.find({ role });
    },
    async create(userData) {
        const newUser = new User(userData);
        return await newUser.save();
    },
    async updateById(userId, updateData) {
        return await User.findByIdAndUpdate(userId, updateData, { new: true });
    },
    async deleteById(userId) {
        return await User.findByIdAndDelete(userId);
    },
    // imperative
    async addToCart(userId, itemId) {
        const menuItem = await Menu.findById(itemId);
        if (!menuItem) throw new Error('Menu item not found');
        
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');
        if (user.role !== 'customer') throw new Error('Only customers can have a cart');

        const existingItem = user.cart.find(cartItem => cartItem.item_id.toString() === itemId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cart.push({ item_id: itemId, quantity: 1 });
        }

        await user.save();
        return user.cart;
    },
};