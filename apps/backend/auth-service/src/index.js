const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');

// Initialize express app
const app = express();

// Middleware
app.use(cors());

// Répondre explicitement aux requêtes OPTIONS
app.options('*', cors());

app.use(express.json());

// Routes
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'auth-service' });
});

// Auth routes
app.use('/', authRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server 
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log(`Auth service running on port ${PORT}`);
}); 