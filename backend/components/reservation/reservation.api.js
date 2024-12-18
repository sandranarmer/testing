const { Reservation } = require('./reservation.schema');
const { auth } = require('../../auth');  // Import auth middleware

module.exports.Init_Reservation = (app) => {
  // Get all reservations
  app.get('/reservations', async (req, res) => {
    try {
      const reservations = await Reservation.find();
      res.status(200).json(reservations);
    } catch (err) {
      console.error('Error fetching reservations:', err);
      res.status(500).json({ error: 'Failed to fetch reservations' });
    }
  });

  // Create a new reservation
  app.post('/reservations', async (req, res) => {
    const { date, table_capacity, location,  } = req.body;
    
    if (!date || !table_capacity || !location  ) {
      return res.status(+400).json({ error: 'All fields are required' });
    }

    try {
      const newReservation = new Reservation({
        date,
        table_capacity,
        location,
      });

      const savedReservation = await newReservation.save();
      res.status(201).json(savedReservation);
    } catch (err) {
      console.error('Error creating reservation:', err);
      res.status(500).json({ error: 'Failed to create reservation' });
    }
  });

  // Update reservation status (only admin can confirm)
  app.patch('/reservations/:id/status', auth('admin'), async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Pending', 'Confirmed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid or missing status.' });
    }

    try {
      const reservation = await Reservation.findById(id);

      if (!reservation) {
        return res.status(404).json({ error: 'Reservation not found.' });
      }

      reservation.status = status;
      const updatedReservation = await reservation.save();

      res.status(200).json({ message: 'Reservation status updated successfully.', reservation: updatedReservation });
    } catch (err) {
      console.error('Error updating reservation status:', err);
      res.status(500).json({ error: 'Failed to update reservation status.' });
    }
  });

  // Delete a reservation
  app.delete('/reservations/:id', auth('admin'), async (req, res) => {
    const { id } = req.params;

    try {
      const deletedReservation = await Reservation.findByIdAndDelete(id);

      if (!deletedReservation) {
        return res.status(404).json({ error: 'Reservation not found.' });
      }

      res.status(200).json({ message: 'Reservation deleted successfully.', deletedReservation });
    } catch (err) {
      console.error('Error deleting reservation:', err);
      res.status(500).json({ error: 'Failed to delete reservation.' });
    }
  });
};