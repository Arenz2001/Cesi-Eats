const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const orderRoutes = require('./routes/order.route');

// Charger les variables d'environnement
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuration Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cesi-eats-orders', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connecté à MongoDB'))
.catch(err => console.error('Erreur de connexion à MongoDB:', err));

app.use('/', orderRoutes);

// Route racine
app.get('/', (req, res) => {
    res.json({
        message: 'Service de commandes opérationnel',
        documentation: `/api-docs`,
        version: '1.0.0'
    });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Une erreur est survenue',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Route 404
app.use((req, res) => {
    res.status(404).json({ message: 'Route non trouvée' });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Service de commande démarré sur le port ${PORT}`);
    console.log(`Documentation Swagger disponible sur http://localhost:${PORT}/api-docs`);
}); 