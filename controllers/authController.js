// controllers/authController.js
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/User');
const sendOtp = require("../utils/sendOtp");
const Otp = require("../models/Otp");
const generateToken = require('../utils/generateToken');

const OTP_EXPIRE_MIN = Number(process.env.OTP_EXPIRE_MIN || 10);

function genOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
}
exports.registerSendOtp = async (req, res) => {
  const { name, email, mobile } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const expireAt = new Date(Date.now() + 10 * 60 * 1000);

  await Otp.create({
    email,
    otp,
    purpose: "register",
    expireAt,
  });

  const ok = await sendOtp({
    toEmail: email,
    otp,
    purpose: "register",
  });

  if (!ok) {
    return res.status(500).json({ msg: "Failed to send OTP email" });
  }

  res.json({ msg: "OTP sent to email" });
};
// exports.registerSendOtp = async (req, res) => {
//   try {
//     const { name, email, mobile } = req.body;
//     if(!name || !email || !mobile) return res.status(400).json({ msg: 'name, email, mobile required' });

//     const exist = await User.findOne({ email });
//     if(exist) return res.status(400).json({ msg: 'Email already registered' });

//     const otp = genOtp();
//     const expireAt = new Date(Date.now() + OTP_EXPIRE_MIN * 60000);

//     await Otp.create({ email, otp, purpose: 'register', expireAt });
//     await sendOtp({ toEmail: email, toMobile: mobile, otp, purpose: 'register' });

//     return res.json({ msg: 'OTP sent to email/mobile (dev: check logs).', otpSent: true });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: 'Server error' });
//   }
// };

exports.verifyRegisterAndCreate = async (req, res) => {
  try {
    // Defensive: ensure req.body exists
    if (!req.body || Object.keys(req.body).length === 0) {
      console.log('verifyRegisterAndCreate: empty req.body');
      return res.status(400).json({ msg: 'Empty request body. Send JSON with name,email,mobile,otp,password' });
    }

    // destructure safely
    const { name, email, mobile, otp, password } = req.body;

    // basic validation
    if (!name || !email || !mobile || !otp || !password) {
      return res.status(400).json({ msg: 'Missing required fields: name, email, mobile, otp, password' });
    }

    // find OTP record
    const record = await Otp.findOne({ email, otp, purpose: 'register' });
    if (!record) return res.status(400).json({ msg: 'Invalid or expired OTP' });

    // check email not already registered (double-check)
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: 'Email already registered' });

    // create user
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, mobile, passwordHash: hash, isVerified: true });

    // cleanup OTPs
    await Otp.deleteMany({ email, purpose: 'register' });

    // create JWT
    const token = generateToken({ id: user._id });

    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error('verifyRegisterAndCreate error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password) return res.status(400).json({ msg: 'email and password required' });

    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if(!ok) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = generateToken({ id: user._id });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.forgotPasswordSendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if(!email) return res.status(400).json({ msg: 'email required' });

    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ msg: 'No user with this email' });

    const otp = genOtp();
    const expireAt = new Date(Date.now() + OTP_EXPIRE_MIN * 60000);

    await Otp.create({ email, otp, purpose: 'forgot', expireAt });
    await sendOtp({ toEmail: email, toMobile: user.mobile, otp, purpose: 'forgot' });

    res.json({ msg: 'OTP sent for password reset' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if(!email || !otp || !newPassword) return res.status(400).json({ msg: 'Missing fields' });

    const record = await Otp.findOne({ email, otp, purpose: 'forgot' });
    if(!record) return res.status(400).json({ msg: 'Invalid or expired OTP' });

    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ msg: 'No user' });

    const hash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = hash;
    await user.save();

    await Otp.deleteMany({ email, purpose: 'forgot' });

    res.json({ msg: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
