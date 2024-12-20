const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { Reservation } = require('./reservation.schema');
const { Init_Reservation } = require('./reservation.api');
const { auth } = require('../../auth');

// Create an express app instance for testing
const app = express();
app.use(express.json());
Init_Reservation(app);

// Mock the Reservation model methods
jest.mock('./reservation.schema');
jest.mock('../../auth', () => ({
  auth: jest.fn().mockImplementation(() => (req, res, next) => next()),  // Bypass auth
}));

// In-memory database URL for testing
const mongoURI = 'mongodb://localhost:27017/test';

beforeAll(async () => {
  // Connect to the in-memory MongoDB instance
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Cleanup database and close connection after tests
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Reservation API E2E Tests', () => {
  // Test for creating a new reservation
  it('should create a new reservation successfully', async () => {
    const reservationData = {
      date: '2024-12-20T18:00:00',
      table_capacity: 4,
      location: 'Main Hall',
    };

    // Mock the save method to return the reservation data
    const mockSave = jest.fn().mockResolvedValue(reservationData);
    Reservation.prototype.save = mockSave;

    const response = await request(app)
      .post('/reservations')
      .send(reservationData);

    expect(response.status).toBe(201);
    expect(response.body.date).toBe(reservationData.date);
    expect(response.body.table_capacity).toBe(reservationData.table_capacity);
    expect(response.body.location).toBe(reservationData.location);
    expect(mockSave).toHaveBeenCalledTimes(1);  // Ensure save method is called once
  });

  // Test for getting all reservations
  it('should return all reservations', async () => {
    const reservations = [
      { date: '2024-12-20T18:00:00', table_capacity: 4, location: 'Main Hall' },
      { date: '2024-12-21T19:00:00', table_capacity: 2, location: 'Private Room' },
    ];

    // Mock the find method to return the reservations array
    Reservation.find.mockResolvedValue(reservations);

    const response = await request(app).get('/reservations');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(reservations);
  });

  // Test for updating reservation status
  it('should update reservation status successfully', async () => {
    const reservationId = new mongoose.Types.ObjectId();  // Generate a valid ObjectId
    const status = 'Confirmed';
    
    const updatedReservation = {
      _id: reservationId,  // Use the generated ObjectId here
      status,
      save: jest.fn().mockResolvedValue({
        _id: reservationId,  // Correct usage of ObjectId
        status,
      }),
    };

    // Mock findById to return the mock reservation document
    Reservation.findById.mockResolvedValue(updatedReservation);

    const response = await request(app)
      .patch(`/reservations/${reservationId}/status`)
      .send({ status });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Reservation status updated successfully.');
    expect(response.body.reservation.status).toBe(status);
    expect(updatedReservation.save).toHaveBeenCalledTimes(1);  // Ensure save method is called once
  });

  // Test for deleting a reservation
  it('should delete a reservation successfully', async () => {
    const reservationId = new mongoose.Types.ObjectId();  // Generate a valid ObjectId
    const deletedReservation = { _id: reservationId, date: '2024-12-20T18:00:00', location: 'Main Hall' };

    // Mock findByIdAndDelete method
    Reservation.findByIdAndDelete.mockResolvedValue(deletedReservation);

    const response = await request(app).delete(`/reservations/${reservationId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Reservation deleted successfully.');
    expect(response.body.deletedReservation._id.toString()).toBe(reservationId.toString());
  });

  // Test for handling reservation not found on delete
  it('should return 404 when reservation is not found for deletion', async () => {
    const reservationId = new mongoose.Types.ObjectId();  // Generate a valid ObjectId
    
    // Mock findByIdAndDelete to return null (reservation not found)
    Reservation.findByIdAndDelete.mockResolvedValue(null);

    const response = await request(app).delete(`/reservations/${reservationId}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Reservation not found.');
  });
});

