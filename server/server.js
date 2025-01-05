const express = require('express');
const sequelize = require('./models'); // Import Sequelize instance
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Test route
app.get('/', (req, res) => {
    res.send('Welcome to the Student Test Platform!');
});

// Import routes
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

// Sync models with the database and start the server
sequelize.sync({ alter: true }) // Adjust the schema without dropping data
    .then(() => {
        console.log('Database synchronized successfully');
        const PORT = process.env.PORT || 5001;
        const NODE_ENV = process.env.NODE_ENV || 'development';
        app.listen(PORT, () => {
            console.log(`App running in ${NODE_ENV} mode on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error synchronizing database:', err);
    });