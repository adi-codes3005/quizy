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
const Question = require('./question')(sequelize, DataTypes); //Relationship for adding questions

Test.hasMany(Question, { foreignKey: 'testId' });
Question.belongsTo(Test, { foreignKey: 'testId' });

const UserTestResult = require('./userTestResult')(sequelize, DataTypes);

User.hasMany(UserTestResult, { foreignKey: 'userId' });
Test.hasMany(UserTestResult, { foreignKey: 'testId' });
UserTestResult.belongsTo(User, { foreignKey: 'userId' });
UserTestResult.belongsTo(Test, { foreignKey: 'testId' });


module.exports = {
    sequelize,
    User,
    Test,
    Question,
    UserTestResult,
};


