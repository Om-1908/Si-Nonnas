const router = require('express').Router();
const { uploadMiddleware, uploadImage } = require('../controllers/upload.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

router.post('/', verifyToken, requireRole('manager'), uploadMiddleware, uploadImage);

module.exports = router;
