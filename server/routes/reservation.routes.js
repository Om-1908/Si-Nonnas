const router = require('express').Router();
const { getSlots, createReservation, getReservations, updateReservation } = require('../controllers/reservation.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

router.get('/slots', getSlots);
router.post('/', createReservation);
router.get('/', verifyToken, requireRole('manager'), getReservations);
router.patch('/:id', verifyToken, requireRole('manager'), updateReservation);

module.exports = router;
