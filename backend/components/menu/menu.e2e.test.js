const express = require('express');
const mongoose = require('mongoose');
const request = require('supertest');
const { Init_Menu } = require('./menu.api');
const { Menu } = require('./menu.schema');
const { auth } = require('../../auth'); // Assuming 'auth' middleware is properly set up
const { MongoMemoryServer } = require('mongodb-memory-server');

// Create an Express app for testing
const app = express();
app.use(express.json());
Init_Menu(app); // Initialize the menu routes

// Setup in-memory database for testing
let mongoServer;

beforeAll(async () => {
  // Start MongoDB in-memory server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Connect to the in-memory database
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Clean up and close database connections after tests
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear the database before each test
  await Menu.deleteMany({});
});

describe('Menu API E2E Tests', () => {

  test('GET /menu - should fetch all menu items', async () => {
    // Add a menu item to the database before the test
    const newItem = new Menu({
      name: 'Latte',
      price: 4,
      description: 'Milk coffee',
      type: 'beverage',
      extra_property: 'Medium',
    });
    await newItem.save();

    const response = await request(app).get('/menu');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].name).toBe('Latte');
  });

  test('GET /menu/:id - should fetch a menu item by ID', async () => {
    const newItem = new Menu({
      name: 'Latte',
      price: 4,
      description: 'Milk coffee',
      type: 'beverage',
      extra_property: 'Medium',
    });
    const savedItem = await newItem.save();

    const response = await request(app).get(`/menu/${savedItem._id}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Latte');
    expect(response.body._id).toBe(savedItem._id.toString());
  });

  test('GET /menu/:id - should return 404 if menu item not found', async () => {
    const response = await request(app).get('/menu/invalid-id');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Menu item not found');
  });

  test('POST /menu - should create a new menu item', async () => {
    const newItem = {
      name: 'Latte',
      price: 4,
      description: 'Milk coffee',
      type: 'beverage',
      extra_property: 'Medium',
    };

    const response = await request(app)
      .post('/menu')
      .send(newItem)
      .set('Authorization', 'Bearer admin_token');  // Use a valid admin token

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Menu item created successfully');
    expect(response.body.item.name).toBe(newItem.name);
  });

  test('PATCH /menu/:id/change-price - should update menu item price', async () => {
    const newItem = new Menu({
      name: 'Latte',
      price: 4,
      description: 'Milk coffee',
      type: 'beverage',
      extra_property: 'Medium',
    });
    const savedItem = await newItem.save();

    const updatedPrice = 5;
    const response = await request(app)
      .patch(`/menu/${savedItem._id}/change-price`)
      .send({ price: updatedPrice })  // Corrected field name
      .set('Authorization', 'Bearer admin_token');  // Use a valid admin token

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Price updated successfully');
    expect(response.body.item.price).toBe(updatedPrice);
  });

  test('DELETE /menu/:id - should delete a menu item', async () => {
    const newItem = new Menu({
      name: 'Latte',
      price: 4,
      description: 'Milk coffee',
      type: 'beverage',
      extra_property: 'Medium',
    });
    const savedItem = await newItem.save();

    const response = await request(app)
      .delete(`/menu/${savedItem._id}`)
      .set('Authorization', 'Bearer admin_token');  // Use a valid admin token

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Menu item deleted successfully');
  });

  test('DELETE /menu/:id - should return 404 if menu item not found', async () => {
    const response = await request(app)
      .delete('/menu/invalid-id')
      .set('Authorization', 'Bearer admin_token');  // Use a valid admin token

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Menu item not found');
  });
});
