require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const dbConnect = require('./config/db');

const app = express();

// CORS
app.use(cors({
  origin: [
    process.env.CLIENT_URL,
    "https://memoryvisualizer.in",
    "https://www.memoryvisualizer.in",
    "http://localhost:5173"
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect Database
dbConnect();

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/memories', require('./routes/memories'));
app.use('/api/upload', require('./routes/upload'));

// Health check API (for ALB)
app.get('/health', (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Ping
app.get('/api/ping', (req, res) => {
  res.json({ ok: true, msg: "Server is up" });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
