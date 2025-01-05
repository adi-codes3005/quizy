const { Sequelize } = require('sequelize');

// Initialize Sequelize
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './test_app.db', // Path to your SQLite database
    logging: process.env.NODE_ENV !== 'production', // Disable logging in production
});

// Export the Sequelize instance
module.exports = sequelize;