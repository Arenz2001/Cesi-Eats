const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/user.routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
require('dotenv').config();
const cors = require('cors');
const app = express();

const corsOptions = {
  origin: ['http://localhost:3000', 'https://api-cesieats.arenz-proxmox.fr'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));
// Initialisation de l'application Express
const PORT = process.env.PORT || 3003;

// Configuration de la connexion MongoDB avec Mongoose
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware par défaut
app.use(express.json()); // Pour parser les requêtes JSON
app.use(express.urlencoded({ extended: true })); // Pour parser les données de formulaire
app.use(express.static(path.join(__dirname, 'public'))); // Pour servir des fichiers statiques

// Routes API
app.use('/api/users', apiRoutes);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'customer-service' });
});

// Route par défaut
app.get('/', (req, res) => {
  res.send('Bienvenue sur le serveur Express');
});

// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).send('Page non trouvée');
});

// Gestion des erreurs générales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Customer Service running on port ${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
}); 