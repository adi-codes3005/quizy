const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Import Sequelize model
const router = express.Router();

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

module.exports = router;