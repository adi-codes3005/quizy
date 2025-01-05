const express = require('express');
const authenticateToken = require('../middleware/auth'); // Import the middleware
const router = express.Router();

// Example protected route
router.get('/dashboard', authenticateToken, (req, res) => {
    res.json({ message: `Welcome, user ${req.user.id}!` });
});

module.exports = router;