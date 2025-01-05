module.exports = (sequelize, DataTypes) => {
    const Test = sequelize.define('Test', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { len: [3, 255] }, // Ensure title is between 3 and 255 characters
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true, // Description is optional
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false, // Duration is required
            validate: { min: 1 }, // Ensure duration is at least 1 minute
        },
    }, {
        timestamps: true, // Adds `createdAt` and `updatedAt` columns
    });

    return Test;
};