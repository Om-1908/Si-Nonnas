const router = require('express').Router()
const { signup, login, logout, getMe, forgotPassword, resetPassword } = require('../controllers/auth.controller')
const { verifyToken } = require('../middleware/auth.middleware')

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)
router.get('/me', verifyToken, getMe)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)

module.exports = router
