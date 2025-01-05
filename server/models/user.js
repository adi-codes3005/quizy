const { DataTypes } = require('sequelize');
const sequelize = require('./index'); // Correct import of Sequelize instance

// Define the User model
const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3, 30], // Username length validation
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true, // Email format validation
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = User;