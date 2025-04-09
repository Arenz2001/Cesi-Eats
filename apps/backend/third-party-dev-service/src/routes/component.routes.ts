import express from 'express';
import { body } from 'express-validator';
import { listComponents, getComponent, downloadComponent } from '../controllers/component.controller';
import { validateRequest } from '../middleware/validate-request';
import { validateApiKey } from '../middleware/validate-api-key';

const router = express.Router();

/**
 * @swagger
 * /api/components:
 *   get:
 *     summary: Lister tous les composants disponibles
 *     tags: [Components]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Liste des composants récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   version:
 *                     type: string
 *                   documentation:
 *                     type: string
 *       401:
 *         description: Clé API invalide ou manquante
 *       500:
 *         description: Erreur serveur
 */
router.get('/', validateApiKey, listComponents);

/**
 * @swagger
 * /api/components/{componentId}:
 *   get:
 *     summary: Obtenir les détails d'un composant
 *     tags: [Components]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: componentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du composant
 *     responses:
 *       200:
 *         description: Détails du composant récupérés avec succès
 *       401:
 *         description: Clé API invalide ou manquante
 *       404:
 *         description: Composant non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:componentId', validateApiKey, getComponent);

/**
 * @swagger
 * /api/components/{componentId}/download:
 *   get:
 *     summary: Télécharger un composant
 *     tags: [Components]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: componentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du composant
 *     responses:
 *       200:
 *         description: URL de téléchargement générée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 downloadUrl:
 *                   type: string
 *                   description: URL de téléchargement du composant
 *       401:
 *         description: Clé API invalide ou manquante
 *       404:
 *         description: Composant non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:componentId/download', validateApiKey, downloadComponent);

export default router; 