const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
  host: 'mysql-32749a69-meghayareshimi-4b05.b.aivencloud.com',
  port: 26132,
  user: 'avnadmin',
  password: process.env.DB_PASSWORD,
  database: 'defaultdb',
  ssl: {
    rejectUnauthorized: false
  }
};

const db = mysql.createConnection(dbConfig);

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database via SSL.');

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(20)
    )
  `;

  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating users table:', err);
    } else {
      console.log('Users table ready.');
    }
  });
});

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Register Endpoint
app.post('/api/register', async (req, res) => {
  console.log('Registration request received:', req.body);
  const { username, email, password, phone } = req.body;

  if (!username || !email || !password) {
    console.log('Missing fields:', { username, email, hasPassword: !!password });
    return res.status(400).json({ error: 'Please provide all required fields.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (username, email, password, phone) VALUES (?, ?, ?, ?)';

    db.query(query, [username, email, hashedPassword, phone], (err, result) => {
      if (err) {
        console.error('Database error during registration:', err);
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: 'Username or Email already exists.' });
        }
        return res.status(500).json({ error: 'Database error: ' + err.message });
      }
      console.log('User registered successfully:', username);
      res.status(201).json({ message: 'User registered successfully!' });
    });
  } catch (error) {
    console.error('Bcrypt or Server error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Login Endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Please provide username and password.' });
  }

  const query = 'SELECT * FROM users WHERE username = ? OR email = ?';
  db.query(query, [username, username], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error.' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    res.json({
      message: 'Login successful!',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone
      }
    });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
