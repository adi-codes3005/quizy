const path = require('path');
//console.log('Current directory:', __dirname);

 require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
//console.log('JWT_SECRET in server.js after loading dotenv:', process.env.JWT_SECRET); // Debugging the secret
const express = require('express');
const { sequelize } = require('./models'); // Import Sequelize instance
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Test route
app.get('/', (req, res) => {
    res.send('Welcome to the Student Test Platform!');
});

// Import routes
console.log('About to load authRoutes.js');
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

const protectedRoutes = require('./routes/protectedRoutes');
app.use('/protected', protectedRoutes); // Mount the protected routes

const testRoutes = require('./routes/testRoutes');
app.use('/tests', testRoutes);

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

