const router = require('express').Router();
const { getMenu, getMenuAdmin, createMenuItem, updateMenuItem, deleteMenuItem } = require('../controllers/menu.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

router.get('/', getMenu);
router.get('/admin', verifyToken, requireRole('manager'), getMenuAdmin);
router.post('/', verifyToken, requireRole('manager'), createMenuItem);
router.patch('/:id', verifyToken, requireRole('manager'), updateMenuItem);
router.delete('/:id', verifyToken, requireRole('manager'), deleteMenuItem);

module.exports = router;
