require('dotenv').config(); // Ensure environment variables are loaded
console.log('JWT_SECRET in authRoutes.js,at TOP:', process.env.JWT_SECRET);
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const User = require('../models/user'); // Import Sequelize model
const { User } = require('../models'); // Import User model from index.js
const rateLimit = require('express-rate-limit'); // Import rate limiter
const router = express.Router();

// Set up rate limiter for login
/*  windowMs: 10 * 60 * 1000: The time window (10 minutes).
    max: 5: Maximum number of login attempts allowed per IP within the time window.
    message: The error message returned when the limit is reached.
    standardHeaders and legacyHeaders: Configure how rate limit information is returned in headers. 
    */
const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5, // Limit each IP to 5 login attempts per windowMs
    message: 'Too many login attempts. Please try again after 10 minutes.',
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Validate fields
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Validate email format (Sequelize already validates this)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        await User.create({ username, email, password: hashedPassword });

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login route with rate limiter
router.post('/login', loginLimiter, async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        console.log('JWT_SECRET in authRoutes.js, at bottom:', process.env.JWT_SECRET);
        // Generate JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful!', token });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;