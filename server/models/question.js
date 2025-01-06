module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define('Question', {
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      optionA: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      optionB: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      optionC: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      optionD: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      correctOption: {
        type: DataTypes.ENUM('A', 'B', 'C', 'D'),
        allowNull: false,
      },
      testId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Tests',
          key: 'id',
        },
      },
    });
  
    return Question;
  };  