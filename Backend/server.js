require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 1. Connect to MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

// 2. Create an API Endpoint to receive form data
app.post('/submit-form', (req, res) => {
  const { name, email, phone } = req.body;
  
  const query = 'INSERT INTO users (name, email, phone) VALUES (?, ?, ?)';
  
  db.query(query, [name, email, phone], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving data');
    } else {
      res.status(200).send('Data saved successfully');
    }
  });
});

// REGISTRATION ROUTE
app.post('/register', async (req, res) => {
  const { name, email, phone, password } = req.body;

  // 1. Validate input
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // 2. Check if user already exists
  const checkUserSql = 'SELECT * FROM users WHERE email = ?';
  
  db.query(checkUserSql, [email], async (err, data) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (data.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    try {
      // 3. Hash password with bcrypt (salt rounds = 10)
      const hashedPassword = await bcrypt.hash(password, 10);

      // 4. Insert new user into database with hashed password
      const insertUserSql = 'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)';
      
      db.query(insertUserSql, [name, email, phone, hashedPassword], (err, result) => {
        if (err) {
          console.error('Insert error:', err);
          return res.status(500).json({ message: 'Failed to create account' });
        }

        return res.status(201).json({ 
          status: 'Success',
          message: 'Account created successfully',
          userId: result.insertId
        });
      });
    } catch (hashError) {
      console.error('Hashing error:', hashError);
      return res.status(500).json({ message: 'Error processing password' });
    }
  });
});

// LOGIN ROUTE
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // 1. Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // 2. Check if user exists
  const sql = 'SELECT * FROM users WHERE email = ?';
  
  db.query(sql, [email], async (err, data) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    // 3. Check if user was found
    if (data.length === 0) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    const user = data[0];

    try {
      // 4. Compare password with hashed password using bcrypt
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        // Password is correct - return user data (excluding password)
        return res.status(200).json({ 
          status: 'Success', 
          message: 'Login successful', 
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone
          }
        });
      } else {
        // Password is incorrect
        return res.status(401).json({ message: 'Wrong password' });
      }
    } catch (compareError) {
      console.error('Password comparison error:', compareError);
      return res.status(500).json({ message: 'Error verifying password' });
    }
  });
});

// CHECK EMAIL ROUTE (for password reset)
app.post('/check-email', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const sql = 'SELECT id FROM users WHERE email = ?';
  
  db.query(sql, [email], (err, data) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (data.length > 0) {
      return res.status(200).json({ exists: true, message: 'Email found' });
    } else {
      return res.status(404).json({ exists: false, message: 'Email not found' });
    }
  });
});

// RESET PASSWORD ROUTE
app.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Email and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    const sql = 'UPDATE users SET password = ? WHERE email = ?';
    
    db.query(sql, [hashedPassword, email], (err, result) => {
      if (err) {
        console.error('Update error:', err);
        return res.status(500).json({ message: 'Failed to update password' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({ 
        status: 'Success',
        message: 'Password updated successfully'
      });
    });
  } catch (hashError) {
    console.error('Hashing error:', hashError);
    return res.status(500).json({ message: 'Error processing password' });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});