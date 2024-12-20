// Repository: Handles database interactions
const { Order } = require('./order.schema');

module.exports.OrderRepository = {
    async findAll() {
        return await Order.find();
    },
    async findById(id) {
        return await Order.findById(id);
    },
    async create(orderData) {
        const newOrder = new Order(orderData);
        return await newOrder.save();
    },
    async updateById(id, updates) {
        return await Order.findByIdAndUpdate(id, updates, { new: true });
    },
    async deleteById(id) {
        return await Order.findByIdAndDelete(id);
    },
};
