const Reservation = require('../models/Reservation');

// GET /api/reservations/slots — available time slots (public)
exports.getSlots = async (req, res) => {
  try {
    const slots = [];
    for (let h = 12; h <= 22; h++) {
      slots.push(`${h}:00`);
      if (h < 22) slots.push(`${h}:30`);
    }
    res.json({ slots });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/reservations — create reservation (public)
exports.createReservation = async (req, res) => {
  try {
    const reservation = await Reservation.create(req.body);
    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/reservations — all reservations with filter (manager)
exports.getReservations = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const reservations = await Reservation.find(filter).sort({ date: -1, time: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/reservations/:id — update status (manager)
exports.updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
