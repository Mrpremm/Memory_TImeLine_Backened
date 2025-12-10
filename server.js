cat > server.js <<'JS'
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const dbConnect = require('./config/db');

const app = express();

// CORS - allow frontend origin(s)
const CLIENT = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // allow non-browser tools
    if(origin === CLIENT || origin === 'https://memoryvisualizer.in' || origin === 'https://www.memoryvisualizer.in'){
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connect DB (make sure your ./config/db exports a function)
dbConnect().then(() => {
  console.log('DB connect attempted');
}).catch(err => {
  console.error('DB connect error (will still start server):', err.message || err);
});

// static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/memories', require('./routes/memories'));
app.use('/api/upload', require('./routes/upload'));

// simple ping + health
app.get('/api/ping', (req, res) => res.json({ ok: true, msg: 'Server is up' }));
app.get('/health', (req, res) => {
  // optional: you can check DB status here if using mongoose
  res.status(200).json({ status: 'ok' });
});

// start server - bind to all interfaces so ALB can reach it
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
JS
