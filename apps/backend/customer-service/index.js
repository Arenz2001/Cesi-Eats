const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const apiRoutes = require('./src/routes/user.routes');
require('dotenv').config();

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 3000;

// Configuration de la connexion MongoDB avec Mongoose
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connexion à MongoDB établie'))
  .catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Middleware par défaut
app.use(express.json()); // Pour parser les requêtes JSON
app.use(express.urlencoded({ extended: true })); // Pour parser les données de formulaire
app.use(express.static(path.join(__dirname, 'public'))); // Pour servir des fichiers statiques

// Routes API
app.use('/', apiRoutes);

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
  res.status(500).send('Erreur serveur');
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
}); 