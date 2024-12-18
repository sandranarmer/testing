// Controller: Manages HTTP requests and responses
const { UserService } = require('./user.service');
const { auth } = require('../../auth');

module.exports.Init_User = (app) => {
    app.post('/user', async (req, res) => {
        try {
            const newUser = await UserService.createUser(req.body);
            res.status(201).json(newUser);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    app.get('/user', auth('admin'), async (req, res) => {
        try {
            const users = await UserService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.get('/user/role/:role', auth('admin'), async (req, res) => {
        try {
            const users = await UserService.getUsersByRole(req.params.role);
            res.status(200).json(users);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    app.get('/user/:id', auth(''), async (req, res) => {
        try {
            const user = await UserService.getUserById(req.params.id);
            res.status(200).json(user);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    });

    app.patch('/user/:id', auth(''), async (req, res) => {
        try {
            const updatedUser = await UserService.updateUser(req.params.id, req.body);
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    app.delete('/user/:id', auth(''), async (req, res) => {
        try {
            const deletedUser = await UserService.deleteUser(req.params.id);
            res.status(200).json(deletedUser);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.patch('/user/addToCart/:id', auth('customer'), async (req, res) => {
        try {
            const cart = await UserService.addToCart(req.params.id, req.body.item_id);
            res.status(200).json({ message: 'Item added to cart', cart });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    app.post('/user/register', async (req, res) => {
        try {
            const newUser = await UserService.register(req.body);
            res.status(201).json(newUser);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    app.post('/user/login', async (req, res) => {
        try {
            const { email, password } = req.body;
            const { token, user } = await UserService.login(email, password);

            res.cookie('token', token, {
                httpOnly: true, 
                secure: false, 
                sameSite: 'strict',
                maxAge: 3600000,
            });

            res.status(200).json({ message: 'Login successful', user });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    app.post('/user/logout', auth(''), async (req, res) => {
        res.clearCookie('token', {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
        });
        res.status(200).json({ message: 'Logout successful' });
    });
};