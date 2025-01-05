const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./index'); // Adjust path if necessary

const User = sequelize.define('User', {
    username: { 
        type: DataTypes.STRING, 
        allowNull: false,
        validate: { len: [3, 30] }
    },
    email: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true,
        validate: { isEmail: true }
    },
    password: { 
        type: DataTypes.STRING, 
        allowNull: false 
    }
}, {
    timestamps: true, // This will automatically add `createdAt` and `updatedAt`
});

module.exports = User;