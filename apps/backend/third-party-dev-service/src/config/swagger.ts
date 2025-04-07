import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cesi-Eats Third Party Developer API',
      version: '1.0.0',
      description: 'API pour les développeurs tiers de Cesi-Eats',
      contact: {
        name: 'Support Cesi-Eats',
        email: 'support@cesi-eats.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement'
      }
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
          description: 'Clé API pour l\'authentification'
        }
      }
    }
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts']
};

export const swaggerSpec = swaggerJsdoc(options); 