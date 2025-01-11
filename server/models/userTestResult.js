module.exports = (sequelize, DataTypes) => {
    const UserTestResult = sequelize.define('UserTestResult', {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Name of the Users table
          key: 'id',
        },
      },
      testId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Tests', // Name of the Tests table
          key: 'id',
        },
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
  
    return UserTestResult;
  };
  