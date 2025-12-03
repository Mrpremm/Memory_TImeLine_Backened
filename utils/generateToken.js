// utils/generateToken.js
const jwt = require('jsonwebtoken');

function generateToken(user) {
  // Accept user object or user id
  const id = user?.id || user?._id || user;
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

module.exports = generateToken;
