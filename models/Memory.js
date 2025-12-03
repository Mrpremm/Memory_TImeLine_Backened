// models/Memory.js
const mongoose = require('mongoose');

const MemorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  tags: [{ type: String }],
  // allow multiple photos
  photoUrls: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Memory', MemorySchema);
