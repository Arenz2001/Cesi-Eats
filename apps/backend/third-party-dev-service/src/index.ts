import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';

import developerRoutes from './routes/developer.routes';
import componentRoutes from './routes/component.routes';
import { swaggerSpec } from './config/swagger';

dotenv.config();

const app = express();

// Middleware pour les logs de requêtes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  // Capturer la réponse pour le logging
  const originalSend = res.send;
  res.send = function(body) {
    console.log(`[${new Date().toISOString()}] Réponse: ${res.statusCode}`);
    if (res.statusCode >= 400) {
      console.error(`Erreur ${res.statusCode}: ${body}`);
    }
    return originalSend.call(this, body);
  };
  
  next();
});

// Middleware pour CORS - plus permissif pour le développement
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));

// Middleware pour parser JSON avec gestion d'erreur
app.use(express.json({
  verify: (req: express.Request, res: express.Response, buf: Buffer) => {
    try {
      JSON.parse(buf.toString());
    } catch (err) {
      const error = err as Error;
      console.error('Erreur de parsing JSON:', error.message);
      res.status(400).json({ message: `Erreur de parsing JSON: ${error.message}` });
      throw error;
    }
  }
}));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/third-party-dev';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/developers', developerRoutes);
app.use('/api/components', componentRoutes);

// Route de base pour tester la connectivité
app.get('/', (req, res) => {
  res.json({ message: 'API du service développeur tiers fonctionnelle' });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erreur serveur:', err.stack);
  res.status(500).json({ 
    message: 'Une erreur est survenue sur le serveur', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
}); 