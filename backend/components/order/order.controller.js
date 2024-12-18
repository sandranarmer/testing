// Controller: Manages HTTP requests and responses
const { OrderService } = require('./order.service');
const { auth } = require('../../auth')

module.exports.Init_Order = (app) => {
    app.get('/order', auth('admin'), async (req, res) => {
        try {
            const orders = await OrderService.getAllOrders();
            res.status(200).json(orders);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch orders' });
        }
    });

    app.get('/order/:id', auth(''), async (req, res) => {
        try {
            const order = await OrderService.getOrderById(req.params.id);
            res.status(200).json(order);
        } catch (err) {
            res.status(404).json({ error: err.message });
        }
    });

    app.post('/order', auth('customer'), async (req, res) => {
        try {
            const { destination, payment_method, status, details, price } = req.body;
            if (!destination || !payment_method || !status || !details || !price) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            const newOrder = await OrderService.createOrder({
                destination,
                payment_method,
                status,
                details,
                price,
            });

            res.status(201).json(newOrder);
        } catch (err) {
            res.status(500).json({ error: 'Failed to create order' });
        }
    });

    app.patch('/order/:id', auth(''), async (req, res) => {
        try {
            const updatedOrder = await OrderService.updateOrder(req.params.id, req.body);
            res.status(200).json(updatedOrder);
        } catch (err) {
            res.status(404).json({ error: err.message });
        }
    });

    app.delete('/order/:id', auth(''), async (req, res) => {
        try {
            const deletedOrder = await OrderService.deleteOrder(req.params.id);
            res.status(200).json({ message: 'Order deleted successfully', deletedOrder });
        } catch (err) {
            res.status(404).json({ error: err.message });
        }
    });
};