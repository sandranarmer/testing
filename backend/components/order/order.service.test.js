const { OrderService } = require('./order.service');
const { OrderRepository } = require('./order.repository');

jest.mock('./order.repository');

describe('OrderService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllOrders', () => {
        it('should return all orders', async () => {
            const mockOrders = [{ id: 1, destination: 'New York' }, { id: 2, destination: 'London' }];
            OrderRepository.findAll.mockResolvedValue(mockOrders);

            const orders = await OrderService.getAllOrders();

            expect(orders).toEqual(mockOrders);
            expect(OrderRepository.findAll).toHaveBeenCalledTimes(1);
        });
    });

    describe('getOrderById', () => {
        it('should return a specific order by ID', async () => {
            const mockOrder = { id: 1, destination: 'New York' };
            OrderRepository.findById.mockResolvedValue(mockOrder);

            const order = await OrderService.getOrderById(1);

            expect(order).toEqual(mockOrder);
            expect(OrderRepository.findById).toHaveBeenCalledWith(1);
        });

        it('should throw error if order not found', async () => {
            OrderRepository.findById.mockResolvedValue(null);

            try {
                await OrderService.getOrderById(999);
            } catch (error) {
                expect(error.message).toBe('Order not found');
            }
        });
    });

    describe('createOrder', () => {
        it('should create a new order', async () => {
            const orderData = { destination: 'New York', payment_method: 'Credit Card', status: 'Pending', details: 'Details', price: 100 };
            OrderRepository.create.mockResolvedValue(orderData);

            const newOrder = await OrderService.createOrder(orderData);

            expect(newOrder).toEqual(orderData);
            expect(OrderRepository.create).toHaveBeenCalledWith(orderData);
        });
    });

    describe('updateOrder', () => {
        it('should update an order', async () => {
            const updatedOrder = { destination: 'Los Angeles' };
            OrderRepository.updateById.mockResolvedValue(updatedOrder);

            const order = await OrderService.updateOrder(1, updatedOrder);

            expect(order).toEqual(updatedOrder);
            expect(OrderRepository.updateById).toHaveBeenCalledWith(1, updatedOrder);
        });

        it('should throw error if order not found', async () => {
            OrderRepository.updateById.mockResolvedValue(null);

            try {
                await OrderService.updateOrder(999, {});
            } catch (error) {
                expect(error.message).toBe('Order not found');
            }
        });
    });

    describe('deleteOrder', () => {
        it('should delete an order', async () => {
            const deletedOrder = { id: 1, destination: 'New York' };
            OrderRepository.deleteById.mockResolvedValue(deletedOrder);

            const result = await OrderService.deleteOrder(1);

            expect(result).toEqual(deletedOrder);
            expect(OrderRepository.deleteById).toHaveBeenCalledWith(1);
        });

        it('should throw error if order not found', async () => {
            OrderRepository.deleteById.mockResolvedValue(null);

            try {
                await OrderService.deleteOrder(999);
            } catch (error) {
                expect(error.message).toBe('Order not found');
            }
        });
    });
});
