const request = require('supertest');
const express = require('express');
const { Init_Order } = require('./order.controller');
const { OrderService } = require('./order.service');
const { auth } = require('../../auth');

jest.mock('./order.service');
jest.mock('../../auth', () => ({
    auth: jest.fn(() => (req, res, next) => next()),
}));

const app = express();
app.use(express.json());
Init_Order(app);

describe('Order Controller Tests', () => {
    describe('GET /order', () => {
        it('should return all orders with a 200 status', async () => {
            const mockOrders = [{ id: 1, destination: 'City A' }, { id: 2, destination: 'City B' }];
            OrderService.getAllOrders.mockResolvedValue(mockOrders);

            const response = await request(app).get('/order');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockOrders);
            expect(OrderService.getAllOrders).toHaveBeenCalledTimes(1);
        });

        it('should return 500 on service failure', async () => {
            OrderService.getAllOrders.mockRejectedValue(new Error('Service Error'));

            const response = await request(app).get('/order');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Failed to fetch orders' });
        });
    });

    describe('GET /order/:id', () => {
        it('should return a single order with a 200 status', async () => {
            const mockOrder = { id: 1, destination: 'City A' };
            OrderService.getOrderById.mockResolvedValue(mockOrder);

            const response = await request(app).get('/order/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockOrder);
            expect(OrderService.getOrderById).toHaveBeenCalledWith('1');
        });

        it('should return 404 if order is not found', async () => {
            OrderService.getOrderById.mockRejectedValue(new Error('Order not found'));

            const response = await request(app).get('/order/999');

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Order not found' });
        });
    });

    describe('POST /order', () => {
        it('should create a new order and return it with a 201 status', async () => {
            const mockOrder = {
                destination: 'City A',
                payment_method: 'credit card',
                status: 'pending',
                details: ['item1', 'item2'],
                price: 100,
            };

            OrderService.createOrder.mockResolvedValue(mockOrder);

            const response = await request(app).post('/order').send(mockOrder);

            expect(response.status).toBe(201);
            expect(response.body).toEqual(mockOrder);
            expect(OrderService.createOrder).toHaveBeenCalledWith(mockOrder);
        });

        it('should return 400 if required fields are missing', async () => {
            const invalidOrder = { destination: 'City A' };

            const response = await request(app).post('/order').send(invalidOrder);

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: 'All fields are required' });
        });
    });

    describe('PATCH /order/:id', () => {
        it('should update an order and return it with a 200 status', async () => {
            const mockUpdatedOrder = { id: 1, destination: 'City A Updated' };
            OrderService.updateOrder.mockResolvedValue(mockUpdatedOrder);

            const response = await request(app)
                .patch('/order/1')
                .send({ destination: 'City A Updated' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUpdatedOrder);
            expect(OrderService.updateOrder).toHaveBeenCalledWith('1', {
                destination: 'City A Updated',
            });
        });

        it('should return 404 if order is not found', async () => {
            OrderService.updateOrder.mockRejectedValue(new Error('Order not found'));

            const response = await request(app)
                .patch('/order/999')
                .send({ destination: 'City A Updated' });

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Order not found' });
        });
    });

    describe('DELETE /order/:id', () => {
        it('should delete an order and return a success message', async () => {
            OrderService.deleteOrder.mockResolvedValue({ id: 1 });

            const response = await request(app).delete('/order/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                message: 'Order deleted successfully',
                deletedOrder: { id: 1 },
            });
            expect(OrderService.deleteOrder).toHaveBeenCalledWith('1');
        });

        it('should return 404 if order is not found', async () => {
            OrderService.deleteOrder.mockRejectedValue(new Error('Order not found'));

            const response = await request(app).delete('/order/999');

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Order not found' });
        });
    });
});
