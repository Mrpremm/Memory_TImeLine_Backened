// server.js

const express = require('express');
const cors = require('cors');
const dbConnect = require('./config/db');
const path = require('path');

require('dotenv').config();
const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//
// connect DB
dbConnect();

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/memories', require('./routes/memories'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/upload', require('./routes/upload'));
// simple ping
app.get('/api/ping', (req, res) => res.json({ ok: true, msg: 'Server is up' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
