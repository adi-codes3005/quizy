const express = require('express');
const { Test } = require('../models'); // Import the Test model from index.js
const authMiddleware = require('../middleware/auth'); // Import JWT auth middleware
const router = express.Router();

// Create a new test (admin only)
router.post('/create', authMiddleware, async (req, res) => {
    const { title, description, timeLimit } = req.body;

    try {
        // Validate input
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        // Create the test
        const newTest = await Test.create({ title, description, duration: timeLimit });

        res.status(201).json({ message: 'Test created successfully', test: newTest });
    } catch (err) {
        console.error('Error creating test:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;