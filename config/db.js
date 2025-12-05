const mongoose = require('mongoose');

module.exports = function dbconnect() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('MONGO_URI not set in .env');   // FIXED
    process.exit(1);
  }

  mongoose
    .connect(uri)
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => {
      console.error('MongoDB connection error:', err.message || err); // FIXED LOG
      process.exit(1);
    });
};
