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

module.exports = router;
