// middlewares/authMiddleware.js  (debug-friendly)
const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function authMiddleware(req, res, next) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (!header || !header.startsWith('Bearer ')) {
    console.log('Auth header missing or malformed:', header);
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const token = header.split(' ')[1];
  console.log('Incoming token:', token?.slice(0, 30) + '...'); // partial log

  try {
    // verify using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token payload:', decoded);

    // support both decoded.id and decoded.userId just in case
    const userId = decoded.id || decoded.userId || decoded.uid;
    if (!userId) {
      console.log('No userId in token payload');
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    const user = await User.findById(userId).select('-password -passwordHash');
    if (!user) {
      console.log('User not found for id:', userId);
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    // attach user for later code
    req.user = user;
    req.userId = userId;
    next();
  } catch (err) {
    console.error('JWT verify error:', err && err.name ? err.name + ': ' + err.message : err);
    return res.status(401).json({ msg: 'Invalid token' });
  }
}

module.exports = authMiddleware;
