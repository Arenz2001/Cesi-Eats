import express from 'express';
import { body } from 'express-validator';
import { createDeveloper, getDeveloper, updateDeveloper, deleteDeveloper } from '../controllers/developer.controller';
import { validateRequest } from '../middleware/validate-request';

const router = express.Router();

// Validation middleware
const developerValidation = [
  body('company').notEmpty().withMessage('Company name is required'),
  body('position').notEmpty().withMessage('Position is required'),
  validateRequest
];

/**
 * @swagger
 * /api/developers:
 *   post:
 *     summary: Créer un profil développeur
 *     tags: [Developers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - company
 *               - position
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID de l'utilisateur (provenant du service d'authentification)
 *               company:
 *                 type: string
 *                 description: Nom de l'entreprise
 *               position:
 *                 type: string
 *                 description: Poste occupé
 *     responses:
 *       201:
 *         description: Profil développeur créé avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/', developerValidation, createDeveloper);

/**
 * @swagger
 * /api/developers/{userId}:
 *   get:
 *     summary: Obtenir un profil développeur
 *     tags: [Developers]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Profil développeur trouvé
 *       404:
 *         description: Développeur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:userId', getDeveloper);

router.get('/', getAllDevelopers);

/**
 * @swagger
 * /api/developers/{userId}:
 *   put:
 *     summary: Mettre à jour un profil développeur
 *     tags: [Developers]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               company:
 *                 type: string
 *                 description: Nouveau nom d'entreprise
 *               position:
 *                 type: string
 *                 description: Nouveau poste
 *     responses:
 *       200:
 *         description: Profil mis à jour avec succès
 *       404:
 *         description: Développeur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/:userId', developerValidation, updateDeveloper);

/**
 * @swagger
 * /api/developers/{userId}:
 *   delete:
 *     summary: Supprimer un profil développeur
 *     tags: [Developers]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Profil supprimé avec succès
 *       404:
 *         description: Développeur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:userId', deleteDeveloper);

export default router; 