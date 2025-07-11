const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// Middleware
// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true
// }));
//app.use(cors());
app.use(express.json());

// Add this before your routes
app.get('/api/test-cors', (req, res) => {
  res.json({ message: 'CORS is working!' });
});
// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/stocks', require('./routes/stockRoutes'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});