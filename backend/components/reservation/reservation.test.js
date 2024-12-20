const request = require('supertest');
const express = require('express');
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

describe('Reservation API', () => {

  // Test for creating a new reservation
  it('should create a new reservation successfully', async () => {
    const reservationData = {
      date: '2024-12-20T18:00:00',
      table_capacity: 4,
      location: 'Main Hall'
    };

    // Mock the save method to return the reservation data
    const mockSave = jest.fn().mockResolvedValue(reservationData);
    Reservation.prototype.save = mockSave;

    const response = await request(app)
      .post('/reservations')
      .send(reservationData);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(reservationData);
    expect(mockSave).toHaveBeenCalledTimes(1);  // Ensure save method is called once
  });

  // Test for getting all reservations
  it('should return all reservations', async () => {
    const reservations = [
      { date: '2024-12-20T18:00:00', table_capacity: 4, location: 'Main Hall' },
      { date: '2024-12-21T19:00:00', table_capacity: 2, location: 'Private Room' }
    ];

    // Mock the find method to return the reservations array
    Reservation.find.mockResolvedValue(reservations);

    const response = await request(app).get('/reservations');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(reservations);
  });

  // Test for updating reservation status
  it('should update reservation status successfully', async () => {
    const reservationId = 'reservation123';
    const status = 'Confirmed';
    const updatedReservation = { _id: reservationId, status };

    // Mock findById to return a mock Reservation instance
    const mockReservationInstance = {
      save: jest.fn().mockResolvedValue(updatedReservation),
      ...updatedReservation, // Include reservation properties like _id and status
    };

    // Mock the findById method to return the mock instance
    Reservation.findById.mockResolvedValue(mockReservationInstance);

    const response = await request(app)
      .patch(`/reservations/${reservationId}/status`)
      .send({ status });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Reservation status updated successfully.');
    expect(response.body.reservation.status).toBe(status);
    expect(mockReservationInstance.save).toHaveBeenCalledTimes(1);  // Ensure save method is called once
  });

  // Test for deleting a reservation
  it('should delete a reservation successfully', async () => {
    const reservationId = 'reservation123';
    const deletedReservation = { _id: reservationId, date: '2024-12-20T18:00:00', location: 'Main Hall' };

    // Mock findByIdAndDelete method to return the deleted reservation
    Reservation.findByIdAndDelete.mockResolvedValue(deletedReservation);

    const response = await request(app).delete(`/reservations/${reservationId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Reservation deleted successfully.');
    expect(response.body.deletedReservation._id).toBe(reservationId);
  });

  // Test for handling reservation not found on delete
  it('should return 404 when reservation is not found for deletion', async () => {
    const reservationId = 'nonexistentReservationId';
    
    // Mock findByIdAndDelete to return null (reservation not found)
    Reservation.findByIdAndDelete.mockResolvedValue(null);

    const response = await request(app).delete(`/reservations/${reservationId}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Reservation not found.');
  });
});
