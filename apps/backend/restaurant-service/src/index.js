const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const path = require('path');
const fs = require('fs');

// Essayer de charger le fichier .env à partir de différents emplacements
const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '../.env'),
  path.resolve(process.cwd(), 'src/.env'),
  path.resolve(__dirname, '.env'),
  path.resolve(__dirname, '../.env')
];

console.log('Chemins .env possibles:');
envPaths.forEach((envPath, index) => {
  console.log(`${index + 1}. ${envPath} (existe: ${fs.existsSync(envPath)})`);
});

// Trouver le premier fichier .env qui existe
const envFile = envPaths.find(p => fs.existsSync(p));
if (envFile) {
  console.log(`Utilisation du fichier .env: ${envFile}`);
  require('dotenv').config({ path: envFile });
} else {
  console.log('Aucun fichier .env trouvé. Définition des variables par défaut.');
  process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant-service';
  process.env.PORT = process.env.PORT || '3002';
}

console.log('Variables d\'environnement chargées:', { 
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: process.env.PORT
});

const restaurantRoutes = require('./routes/restaurant.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

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
.then(() => console.log('Connecté à MongoDB'))
.catch(err => console.error('Erreur de connexion à MongoDB :', err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Restaurant service running on port ${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
}); 