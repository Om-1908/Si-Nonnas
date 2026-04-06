const router = require('express').Router();
const { createOrder, getOrders, getMyOrders, getOrder, updateOrderStatus, updatePaymentStatus, exportOrders } = require('../controllers/order.controller');
const { verifyToken, optionalAuth } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

router.post('/', optionalAuth, createOrder);
router.get('/my', verifyToken, getMyOrders);
router.get('/export', verifyToken, requireRole('manager'), exportOrders);
router.get('/:id', getOrder);
router.get('/', verifyToken, requireRole('manager', 'kitchen_staff'), getOrders);
router.patch('/:id/status', verifyToken, requireRole('kitchen_staff', 'manager'), updateOrderStatus);
router.patch('/:id/payment-status', optionalAuth, updatePaymentStatus);

module.exports = router;
