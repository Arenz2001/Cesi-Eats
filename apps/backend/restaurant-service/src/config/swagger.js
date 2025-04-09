const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Restaurant Service API',
      version: '1.0.0',
      description: 'API documentation for the Restaurant Service',
    },
    servers: [
      {
        url: 'http://localhost:3002',
        description: 'Local development server',
      },
      {
        url: 'http://restaurant-service:3002',
        description: 'Docker development server',
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../routes/**/*.js')
  ], // Chemin vers les fichiers de routes
};

const specs = swaggerJsdoc(options);

module.exports = specs; 