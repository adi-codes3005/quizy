const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../models/db');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Register user
router.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    // Validate password length
    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        if (row) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).json({ error: 'Error hashing password' });
            }

            // Insert the new user into the database
            db.run(
                'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
                [username, hash, email],
                function (err) {
                    if (err) {
                        console.error('Error saving user:', err);
                        return res.status(500).json({ error: 'Error saving user' });
                    }

                    res.status(201).json({ message: 'User registered successfully!' });
                }
            );
        });
    });
});


// Login user
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Check if user exists
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Database query error' });
        }
        if (!row) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Compare passwords
        bcrypt.compare(password, row.password, (err, result) => {
            if (err || !result) {
                return res.status(400).json({ error: 'Invalid password' });
            }

            // Generate JWT
            try {
                const token = jwt.sign({ id: row.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.status(200).json({ message: 'Login successful!', token });
            } catch (err) {
                res.status(500).json({ error: 'Error generating token' });
            }
        });
    });
});

module.exports = router;