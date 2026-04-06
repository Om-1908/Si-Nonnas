const router = require('express').Router();
const { createPaymentOrder, verifyPayment, getPayments, exportPayments } = require('../controllers/payment.controller');
const { verifyToken, optionalAuth } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

router.post('/create-order', optionalAuth, createPaymentOrder);
router.post('/verify', optionalAuth, verifyPayment);
router.get('/export', verifyToken, requireRole('manager'), exportPayments);
router.get('/', verifyToken, requireRole('manager'), getPayments);

module.exports = router;
