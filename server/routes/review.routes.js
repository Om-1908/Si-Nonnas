const router = require('express').Router();
const { createReview, getReviews, replyToReview } = require('../controllers/review.controller');
const { verifyToken, optionalAuth } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

router.post('/', optionalAuth, createReview);
router.get('/', verifyToken, requireRole('manager'), getReviews);
router.post('/:id/reply', verifyToken, requireRole('manager'), replyToReview);

module.exports = router;
