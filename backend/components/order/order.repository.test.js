const mongoose = require('mongoose');
const { Order } = require('./order.schema');
const { OrderRepository } = require('./order.repository');

jest.mock('./order.schema', () => ({
    Order: {
        find: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(), // Mock create method
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
    },
}));

describe('OrderRepository', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findAll', () => {
        it('should retrieve all orders', async () => {
            const mockOrders = [{ id: '1', name: 'Order 1' }, { id: '2', name: 'Order 2' }];
            Order.find.mockResolvedValue(mockOrders);

            const result = await OrderRepository.findAll();

            expect(Order.find).toHaveBeenCalled();
            expect(result).toEqual(mockOrders);
        });
    });

    describe('findById', () => {
        it('should retrieve an order by ID', async () => {
            const mockOrder = { id: '1', name: 'Order 1' };
            Order.findById.mockResolvedValue(mockOrder);

            const result = await OrderRepository.findById('1');

            expect(Order.findById).toHaveBeenCalledWith('1');
            expect(result).toEqual(mockOrder);
        });

        it('should return null if no order is found', async () => {
            Order.findById.mockResolvedValue(null);

            const result = await OrderRepository.findById('nonexistent-id');

            expect(Order.findById).toHaveBeenCalledWith('nonexistent-id');
            expect(result).toBeNull();
        });
    });

    describe('create', () => {
        it('should create a new order', async () => {
            const mockOrderData = { destination: 'A', payment_method: 'cash', status: 'new', details: ['item1'], price: 100 };
            const mockSavedOrder = { ...mockOrderData, id: '1' };

            // Mock create to return the mocked saved order
            Order.create.mockResolvedValue(mockSavedOrder);

            const result = await OrderRepository.create(mockOrderData);

            expect(Order.create).toHaveBeenCalledWith(mockOrderData);  // Ensure correct data is passed to create
            expect(result).toEqual(mockSavedOrder);  // Ensure the mock saved order is returned
        });
    });

    describe('updateById', () => {
        it('should update an order by ID', async () => {
            const mockUpdates = { status: 'completed' };
            const mockUpdatedOrder = { id: '1', ...mockUpdates };
            Order.findByIdAndUpdate.mockResolvedValue(mockUpdatedOrder);

            const result = await OrderRepository.updateById('1', mockUpdates);

            expect(Order.findByIdAndUpdate).toHaveBeenCalledWith('1', mockUpdates, { new: true });
            expect(result).toEqual(mockUpdatedOrder);
        });

        it('should return null if the order to update is not found', async () => {
            Order.findByIdAndUpdate.mockResolvedValue(null);

            const result = await OrderRepository.updateById('nonexistent-id', { status: 'completed' });

            expect(Order.findByIdAndUpdate).toHaveBeenCalledWith('nonexistent-id', { status: 'completed' }, { new: true });
            expect(result).toBeNull();
        });
    });

    describe('deleteById', () => {
        it('should delete an order by ID', async () => {
            const mockDeletedOrder = { id: '1', name: 'Order 1' };
            Order.findByIdAndDelete.mockResolvedValue(mockDeletedOrder);

            const result = await OrderRepository.deleteById('1');

            expect(Order.findByIdAndDelete).toHaveBeenCalledWith('1');
            expect(result).toEqual(mockDeletedOrder);
        });

        it('should return null if the order to delete is not found', async () => {
            Order.findByIdAndDelete.mockResolvedValue(null);

            const result = await OrderRepository.deleteById('nonexistent-id');

            expect(Order.findByIdAndDelete).toHaveBeenCalledWith('nonexistent-id');
            expect(result).toBeNull();
        });
    });
});
