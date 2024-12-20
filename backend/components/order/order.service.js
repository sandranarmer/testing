// Service: Encapsulates business logic
const { OrderRepository } = require('./order.repository');

module.exports.OrderService = {
    async getAllOrders() {
        return await OrderRepository.findAll();
    },
    async getOrderById(id) {
        const order = await OrderRepository.findById(id);
        if (!order) throw new Error('Order not found');
        return order;
    },
    async createOrder(orderData) {
        return await OrderRepository.create(orderData);
    },
    async updateOrder(id, updates) {
        const updatedOrder = await OrderRepository.updateById(id, updates);
        if (!updatedOrder) throw new Error('Order not found');
        return updatedOrder;
    },
    async deleteOrder(id) {
        const deletedOrder = await OrderRepository.deleteById(id);
        if (!deletedOrder) throw new Error('Order not found');
        return deletedOrder;
    },
};
