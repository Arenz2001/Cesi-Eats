const express = require('express');
const { body } = require('express-validator');
const restaurantController = require('../controller/restaurant.controller');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Restaurant:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - cuisineType
 *       properties:
 *         name:
 *           type: string
 *           description: Nom du restaurant
 *         address:
 *           type: string
 *           description: Adresse du restaurant
 *         cuisineType:
 *           type: string
 *           description: Type de cuisine
 *         rating:
 *           type: number
 *           description: Note du restaurant
 *         isOpen:
 *           type: boolean
 *           description: Statut d'ouverture
 */

// Validations pour la création/mise à jour d'un restaurant
const restaurantValidation = [
  body('name').notEmpty().withMessage('Le nom est requis'),
  body('address.street').notEmpty().withMessage('L\'adresse est requise'),
  body('address.city').notEmpty().withMessage('La ville est requise'),
  body('address.postalCode').notEmpty().withMessage('Le code postal est requis')
];

// Validations pour l'ajout/mise à jour d'un plat
const dishValidation = [
  body('name').notEmpty().withMessage('Le nom du plat est requis'),
  body('price').isNumeric().withMessage('Le prix doit être un nombre')
];

/**
 * @swagger
 * /api/restaurants:
 *   get:
 *     summary: Récupère tous les restaurants
 *     tags: [Restaurants]
 *     responses:
 *       200:
 *         description: Liste des restaurants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Restaurant'
 */
router.get('/', restaurantController.getAllRestaurants);

/**
 * @swagger
 * /api/restaurants/{id}:
 *   get:
 *     summary: Récupère un restaurant par son ID
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du restaurant
 *     responses:
 *       200:
 *         description: Détails du restaurant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       404:
 *         description: Restaurant non trouvé
 */
router.get('/:id', restaurantController.getRestaurantById);

router.get('/name/:name', restaurantController.getRestaurantByName);
router.get('/:id/menu', restaurantController.getMenu);
router.get('/city/:city', restaurantController.searchByCity);

// Routes sans authentification
/**
 * @swagger
 * /api/restaurants:
 *   post:
 *     summary: Crée un nouveau restaurant
 *     tags: [Restaurants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Restaurant'
 *     responses:
 *       201:
 *         description: Restaurant créé avec succès
 *       400:
 *         description: Données invalides
 */
router.post('/', restaurantValidation, restaurantController.createRestaurant);

/**
 * @swagger
 * /api/restaurants/{id}:
 *   put:
 *     summary: Met à jour un restaurant
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du restaurant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Restaurant'
 *     responses:
 *       200:
 *         description: Restaurant mis à jour
 *       404:
 *         description: Restaurant non trouvé
 */
router.put('/:id', restaurantValidation, restaurantController.updateRestaurant);

/**
 * @swagger
 * /api/restaurants/{id}:
 *   delete:
 *     summary: Supprime un restaurant
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du restaurant
 *     responses:
 *       200:
 *         description: Restaurant supprimé
 *       404:
 *         description: Restaurant non trouvé
 */
router.delete('/:id', restaurantController.deleteRestaurant);

router.post('/:id/dishes', dishValidation, restaurantController.addDish);
router.put('/:restaurantId/dishes/:dishId', dishValidation, restaurantController.updateDish);
router.delete('/:restaurantId/dishes/:dishId', restaurantController.removeDish);

module.exports = router;