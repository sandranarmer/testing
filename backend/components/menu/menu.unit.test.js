const { Init_Menu } = require('./menu.api');
const { Menu } = require('./menu.schema');
const request = require('supertest');
const express = require('express');
const { auth } = require('../../auth');

// Mocking the dependencies
jest.mock('./menu.schema');
jest.mock('../../auth', () => ({
  auth: jest.fn(() => (req, res, next) => next()), // Mocking auth middleware to always pass
}));

// Create an Express app for testing
const app = express();
app.use(express.json()); // Middleware to parse JSON
Init_Menu(app); // Initialize the routes

describe('Unit Tests for Menu API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /menu - should fetch all menu items', async () => {
    // Mock data
    const mockItems = [
      { _id: '1', name: 'Latte', price: 4, description: 'Milk coffee', type: 'beverage', extra_property: 'Medium' },
      { _id: '2', name: 'Brownie', price: 3, description: 'Chocolate brownie', type: 'dessert', extra_property: '400 calories' },
    ];
    
    // Mocking Menu.find method
    Menu.find.mockResolvedValue(mockItems);

    // Call the API
    const response = await request(app).get('/menu');

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockItems);
    expect(Menu.find).toHaveBeenCalledTimes(1);
  });

  test('GET /menu/:id - should fetch a menu item by ID', async () => {
    const mockItem = { _id: '1', name: 'Latte', price: 4, description: 'Milk coffee', type: 'beverage', extra_property: 'Medium' };
    
    // Mocking Menu.findById method
    Menu.findById.mockResolvedValue(mockItem);

    const response = await request(app).get('/menu/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockItem);
    expect(Menu.findById).toHaveBeenCalledWith('1');
  });

  test('GET /menu/:id - should return 404 if menu item not found', async () => {
    // Mocking Menu.findById method to return null
    Menu.findById.mockResolvedValue(null);

    const response = await request(app).get('/menu/999');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Menu item not found' });
    expect(Menu.findById).toHaveBeenCalledWith('999');
  });

  test('POST /menu - should create a new menu item', async () => {
    const inputItem = {
      name: 'Latte',
      price: 4,
      description: 'Milk coffee',
      type: 'beverage',
      extra_property: 'Medium',
    };

    const savedItem = { ...inputItem, _id: '12345', createdAt: new Date() };

    // Mocking the save method
    Menu.prototype.save = jest.fn().mockResolvedValue(savedItem);

    const response = await request(app)
      .post('/menu')
      .send(inputItem)
      .set('Authorization', 'Bearer admin_token'); // Mock auth token

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Menu item created successfully');
    expect(Menu.prototype.save).toHaveBeenCalledTimes(1);
  });

  test('POST /menu - should return 400 if required fields are missing', async () => {
    const inputItem = { name: 'Latte', price: 4 }; // Missing required fields

    const response = await request(app)
      .post('/menu')
      .send(inputItem)
      .set('Authorization', 'Bearer admin_token');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'All fields are required' });
  });

  test('PATCH /menu/:id/change-price - should update menu item price', async () => {
    const mockItem = { _id: '1', name: 'Latte', price: 4, description: 'Milk coffee', type: 'beverage', extra_property: 'Medium' };
    Menu.findById.mockResolvedValue(mockItem);
    mockItem.save = jest.fn().mockResolvedValue({ ...mockItem, price: 5 });

    const response = await request(app)
      .patch('/menu/1/change-price')
      .send({ newPrice: 5 })
      .set('Authorization', 'Bearer admin_token');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Price updated successfully');
    expect(Menu.findById).toHaveBeenCalledWith('1');
    expect(mockItem.save).toHaveBeenCalledTimes(1);
  });

  test('PATCH /menu/:id/change-price - should return 400 if no newPrice is provided', async () => {
    const response = await request(app)
      .patch('/menu/1/change-price')
      .send({}) // Missing newPrice
      .set('Authorization', 'Bearer admin_token');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'New price is required' });
  });

  test('DELETE /menu/:id - should delete a menu item', async () => {
    const mockItem = { _id: '1', name: 'Latte', price: 4, description: 'Milk coffee', type: 'beverage', extra_property: 'Medium' };
    Menu.findByIdAndDelete.mockResolvedValue(mockItem);

    const response = await request(app)
      .delete('/menu/1')
      .set('Authorization', 'Bearer admin_token');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Menu item deleted successfully');
    expect(Menu.findByIdAndDelete).toHaveBeenCalledWith('1');
  });

  test('DELETE /menu/:id - should return 404 if menu item not found', async () => {
    Menu.findByIdAndDelete.mockResolvedValue(null);

    const response = await request(app)
      .delete('/menu/999')
      .set('Authorization', 'Bearer admin_token');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Menu item not found' });
    expect(Menu.findByIdAndDelete).toHaveBeenCalledWith('999');
  });
});
