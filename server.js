require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Track user activity with cookies
app.use((req, res, next) => {
  // Create a tracking cookie with visit info
  if (!req.cookies.trackingId) {
    const trackingId = Math.random().toString(36).substring(2, 15);
    res.cookie('trackingId', trackingId, { maxAge: 900000, httpOnly: true });

    // Log new visitor
    console.log(`New visitor: ${trackingId}`);
  } else {
    // Log returning visitor
    console.log(`Return visitor: ${req.cookies.trackingId}`);
  }

  // Store visit data (vulnerable as it collects information without proper consent)
  const visitInfo = {
    timestamp: new Date(),
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    trackingId: req.cookies.trackingId || 'unknown',
    path: req.path
  };

  console.log('Visit logged:', visitInfo);
  next();
});

// Vulnerable login endpoint (susceptible to blind SQL injection)
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // VULNERABLE CODE: Direct string concatenation in SQL query
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

    console.log('Executing query:', query); // For demonstration purposes

    const result = await pool.query(query);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      // Create session cookie
      res.cookie('session', Buffer.from(JSON.stringify({
        id: user.id,
        username: user.username,
        is_admin: user.is_admin
      })).toString('base64'), { maxAge: 3600000, httpOnly: true });

      res.json({ success: true, message: 'Login successful' });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'An error occurred during login' });
  }
});

// User info endpoint - will return data based on session cookie
app.get('/api/user', (req, res) => {
  if (!req.cookies.session) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  try {
    const sessionData = JSON.parse(Buffer.from(req.cookies.session, 'base64').toString());
    res.json({
      success: true,
      user: {
        username: sessionData.username,
        is_admin: sessionData.is_admin
      }
    });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid session' });
  }
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  res.clearCookie('session');
  res.json({ success: true, message: 'Logged out successfully' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`WARNING: This application contains deliberately vulnerable code for educational purposes only!`);
});
