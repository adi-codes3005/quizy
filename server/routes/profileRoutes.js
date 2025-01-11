const express = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Update profile
router.put('/update', authMiddleware, async (req, res) => {
    const { username, email } = req.body;
    const userId = req.user.id; // Get userId from JWT

    try {
        if (!username || !email) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        await User.update({ username, email }, { where: { id: userId } });
        res.status(200).json({ message: 'Profile updated successfully!' });
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Change password
router.put('/change-password', authMiddleware, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#_+~])[A-Za-z\d@$!%*?&^#_+~]{8,50}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                error: 'Password must be 8-50 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.update({ password: hashedPassword }, { where: { id: userId } });

        res.status(200).json({ message: 'Password changed successfully!' });
    } catch (err) {
        console.error('Error changing password:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;