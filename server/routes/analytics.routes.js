const router = require('express').Router();
const { getSummary, getRevenue, getTopItems, getOrdersByHour } = require('../controllers/analytics.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

router.get('/summary', verifyToken, requireRole('manager'), getSummary);
router.get('/revenue', verifyToken, requireRole('manager'), getRevenue);
router.get('/top-items', verifyToken, requireRole('manager'), getTopItems);
router.get('/orders-by-hour', verifyToken, requireRole('manager'), getOrdersByHour);

module.exports = router;
