const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const restaurantRoutes = require('./routes/restaurant.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'restaurant-service' });
});

// Restaurant routes
app.use('/api/restaurants', restaurantRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(' Connecté à MongoDB'))
.catch(err => console.error(' Erreur de connexion à MongoDB :', err));


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Restaurant service running on port ${PORT}`);
}); 