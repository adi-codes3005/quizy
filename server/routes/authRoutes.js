const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../models/db');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Register user
router.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    // Check if all fields are provided
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format using regex
    /* ^[a-zA-Z0-9._%+-]+: Allowed characters before the @ symbol.
    @[a-zA-Z0-9.-]+: Valid domain name.
    \.[a-zA-Z]{2,}$: Top-level domain with at least 2 characters (e.g., .com). */
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }
    
    // Validate username length (3-30 characters)
    if (username.length < 3 || username.length > 30) {
        return res.status(400).json({ error: 'Username must be between 3 and 30 characters long' });
    }

    // Validate password strength
    /* (?=.*[a-z]): At least one lowercase letter.
    (?=.*[A-Z]): At least one uppercase letter.
    (?=.*\d): At least one digit.
    (?=.*[@$!%*?&^#_+~]): At least one special character from the allowed set.
    {8,50}: Length between 8 and 50 characters. */
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#_+~])[A-Za-z\d@$!%*?&^#_+~]{8,50}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            error: 'Password must be 8-50 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (e.g., @, $, !, %, *, ?, &).'
        });
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