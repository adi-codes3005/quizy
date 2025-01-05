const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.resolve(__dirname, '../test_app.db'), // Use absolute path to store the database in the server folder
    logging: process.env.NODE_ENV !== 'production' ? console.log : false, // Disable logs in production
});
//console.log("storage in index.js:", storage);

const User = require('./user')(sequelize, DataTypes); // Load User model
const Test = require('./test')(sequelize, DataTypes); // Load Test model

module.exports = {
    sequelize,
    User,
    Test,
};