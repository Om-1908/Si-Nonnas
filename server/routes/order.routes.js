const router = require('express').Router();
const { createOrder, getOrders, getMyOrders, getOrder, updateOrderStatus, exportOrders } = require('../controllers/order.controller');
const { verifyToken, optionalAuth } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

router.post('/', optionalAuth, createOrder);
router.get('/my', verifyToken, getMyOrders);
router.get('/export', verifyToken, requireRole('manager'), exportOrders);
router.get('/:id', getOrder);
router.get('/', verifyToken, requireRole('manager'), getOrders);
router.patch('/:id/status', verifyToken, requireRole('kitchen_staff', 'manager'), updateOrderStatus);

module.exports = router;
