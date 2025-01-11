const express = require('express');
const { UserTestResult, User, Test } = require('../models');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// View results for a specific user
router.get('/:userId', authMiddleware, async (req, res) => {
    const { userId } = req.params;

    try {
        const results = await UserTestResult.findAll({
            where: { userId },
            include: [{ model: Test, attributes: ['title', 'description'] }],
        });

        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching results:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Leaderboard for a test
router.get('/:testId/leaderboard', authMiddleware, async (req, res) => {
    const { testId } = req.params;

    try {
        const leaderboard = await UserTestResult.findAll({
            where: { testId },
            include: [{ model: User, attributes: ['username'] }],
            order: [['score', 'DESC']],
            limit: 10, // Top 10 scores
        });

        res.status(200).json(leaderboard);
    } catch (err) {
        console.error('Error fetching leaderboard:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;