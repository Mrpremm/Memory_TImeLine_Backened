const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware'); // your JWT middleware
const User = require('../models/User'); // your User model
// routes/auth.js
const router = require('express').Router();
const ctrl = require('../controllers/authController');

// registration: two-step
router.post('/register/send-otp', ctrl.registerSendOtp);    // provide name,email,mobile -> sends OTP
router.post('/register/verify', ctrl.verifyRegisterAndCreate); // provide name,email,mobile,otp,password -> create account

// login
router.post('/login', ctrl.login);

// forgot / reset
router.post('/forgot/send-otp', ctrl.forgotPasswordSendOtp); // provide email -> sends otp
router.post('/forgot/reset', ctrl.resetPasswordWithOtp);     // provide email, otp, newPassword -> reset
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password'); // omit password
    if (!user) return res.status(404).json({ msg: 'User not found' });
    return res.json({ user });
  } catch (err) {
    console.error('GET /auth/me error', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});
module.exports = router;
