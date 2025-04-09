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
 *           type: object
 *           properties:
 *             street:
 *               type: string
 *               description: Rue du restaurant
 *             city:
 *               type: string
 *               description: Ville du restaurant
 *             postalCode:
 *               type: string
 *               description: Code postal du restaurant
 *         cuisineType:
 *           type: string
 *           description: Type de cuisine
 *         rating:
 *           type: number
 *           description: Note du restaurant
 *         isOpen:
 *           type: boolean
 *           description: Statut d'ouverture
 *     Dish:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         name:
 *           type: string
 *           description: Nom du plat
 *         price:
 *           type: number
 *           description: Prix du plat
 *         description:
 *           type: string
 *           description: Description du plat
 *         category:
 *           type: string
 *           description: Catégorie du plat
 */

// Validations
const restaurantValidation = [
  body('name').notEmpty().withMessage('Le nom est requis'),
  body('address.street').notEmpty().withMessage('L\'adresse est requise'),
  body('address.city').notEmpty().withMessage('La ville est requise'),
  body('address.postalCode').notEmpty().withMessage('Le code postal est requis')
];

const dishValidation = [
  body('name').notEmpty().withMessage('Le nom du plat est requis'),
  body('price').isNumeric().withMessage('Le prix doit être un nombre')
];

// Routes des restaurants
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
 * /api/restaurants/name/{name}:
 *   get:
 *     summary: Récupère un restaurant par son nom
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Nom du restaurant
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
router.get('/name/:name', restaurantController.getRestaurantByName);

/**
 * @swagger
 * /api/restaurants/city/{city}:
 *   get:
 *     summary: Recherche des restaurants par ville
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: city
 *         schema:
 *           type: string
 *         required: true
 *         description: Ville de recherche
 *     responses:
 *       200:
 *         description: Liste des restaurants dans la ville
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Restaurant'
 */
router.get('/city/:city', restaurantController.searchByCity);

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

// Routes des plats
/**
 * @swagger
 * /api/restaurants/{id}/menu:
 *   get:
 *     summary: Récupère le menu d'un restaurant
 *     tags: [Dishes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du restaurant
 *     responses:
 *       200:
 *         description: Menu du restaurant
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Dish'
 *       404:
 *         description: Restaurant non trouvé
 */
router.get('/:id/menu', restaurantController.getMenu);

/**
 * @swagger
 * /api/restaurants/{id}/dishes:
 *   post:
 *     summary: Ajoute un plat au menu d'un restaurant
 *     tags: [Dishes]
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
 *             $ref: '#/components/schemas/Dish'
 *     responses:
 *       201:
 *         description: Plat ajouté avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Restaurant non trouvé
 */
router.post('/:id/dishes', dishValidation, restaurantController.addDish);

/**
 * @swagger
 * /api/restaurants/{restaurantId}/dishes/{dishId}:
 *   put:
 *     summary: Met à jour un plat dans le menu d'un restaurant
 *     tags: [Dishes]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du restaurant
 *       - in: path
 *         name: dishId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du plat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Dish'
 *     responses:
 *       200:
 *         description: Plat mis à jour
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Restaurant ou plat non trouvé
 */
router.put('/:restaurantId/dishes/:dishId', dishValidation, restaurantController.updateDish);

/**
 * @swagger
 * /api/restaurants/{restaurantId}/dishes/{dishId}:
 *   delete:
 *     summary: Supprime un plat du menu d'un restaurant
 *     tags: [Dishes]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du restaurant
 *       - in: path
 *         name: dishId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du plat
 *     responses:
 *       200:
 *         description: Plat supprimé
 *       404:
 *         description: Restaurant ou plat non trouvé
 */
router.delete('/:restaurantId/dishes/:dishId', restaurantController.removeDish);

module.exports = router;