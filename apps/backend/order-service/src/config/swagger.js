const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Service de Commandes - Cesi Eats',
      version: '1.0.0',
      description: 'Documentation de l\'API du service de commandes pour Cesi Eats',
    },
    servers: [
      {
        url: 'http://localhost:3002',
        description: 'Serveur de développement',
      },
    ],
  },
  apis: [path.join(__dirname, '../routes/*.js')], // Utilisation de path.join pour un chemin absolu
};

const specs = swaggerJsdoc(options);

module.exports = specs; 