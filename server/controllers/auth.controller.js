const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const User = require('../models/User')

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    // Reject non-customer role requests at signup
    if (role && role !== 'customer') {
      return res.status(403).json({ message: 'Signup not allowed for this role' })
    }

    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    const user = await User.create({ name, email, password, role: 'customer' })
    const token = generateToken(user)

    res.status(201).json({
      user: user.toJSON(),
      role: user.role,
      token,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = generateToken(user)

    res.json({
      user: user.toJSON(),
      role: user.role,
      name: user.name,
      token,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.logout = async (req, res) => {
  res.json({ message: 'Logged out successfully' })
}

exports.getMe = async (req, res) => {
  try {
    res.json({
      user: req.user.toJSON(),
      role: req.user.role,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email: email.toLowerCase() })

    // Always respond 200 to prevent email enumeration
    if (!user) {
      return res.json({ message: 'If that email exists, a reset link has been sent.' })
    }

    // Generate raw token and hashed version
    const rawToken = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex')

    user.resetToken = hashedToken
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000 // 15 minutes
    await user.save()

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${rawToken}`

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    await transporter.sendMail({
      from: `"Si Nonna's" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Reset your Si Nonna's password",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
          <h2 style="color:#FF9E18">Password Reset Request</h2>
          <p>Click the link below to reset your password. This link expires in 15 minutes.</p>
          <a href="${resetLink}" style="display:inline-block;background:#FF9E18;color:#2c1700;padding:12px 24px;border-radius:4px;text-decoration:none;font-weight:bold;margin:16px 0">
            Reset Password
          </a>
          <p style="color:#888;font-size:12px">If you didn't request this, ignore this email.</p>
        </div>
      `,
    })

    res.json({ message: 'If that email exists, a reset link has been sent.' })
  } catch (error) {
    console.error('Forgot password error:', error.message)
    res.status(500).json({ message: 'Failed to send reset email. Check server email config.' })
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params
    const { password } = req.body

    // Hash incoming token and match against stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset link.' })
    }

    user.password = password // pre-save hook re-hashes it
    user.resetToken = null
    user.resetTokenExpiry = null
    await user.save()

    res.json({ message: 'Password reset successfully.' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
