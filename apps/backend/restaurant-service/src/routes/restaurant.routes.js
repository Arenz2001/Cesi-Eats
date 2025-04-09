const express = require('express');
const { body } = require('express-validator');
const restaurantController = require('../controller/restaurant.controller');

const router = express.Router();

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

// Validations pour les menus
const menuValidation = [
  body('name').notEmpty().withMessage('Le nom du menu est requis'),
  body('price').isNumeric().withMessage('Le prix doit être un nombre'),
  body('dishes').isArray().withMessage('Les plats doivent être dans un tableau')
];

// Routes publiques
router.get('/', restaurantController.getAllRestaurants);
router.get('/id/:id', restaurantController.getRestaurantById);
router.get('/name/:name', restaurantController.getRestaurantByName);
router.get('/:id/menu', restaurantController.getMenu);
router.get('/city/:city', restaurantController.searchByCity);

// Routes sans authentification
router.post('/', restaurantValidation, restaurantController.createRestaurant);
router.put('/:id', restaurantValidation, restaurantController.updateRestaurant);
router.delete('/:id', restaurantController.deleteRestaurant);
router.post('/:id/dishes', dishValidation, restaurantController.addDish);
router.put('/:restaurantId/dishes/:dishId', dishValidation, restaurantController.updateDish);
router.delete('/:restaurantId/dishes/:dishId', restaurantController.removeDish);

// Routes pour les menus
router.get('/:id/menus', restaurantController.getMenus);
router.post('/:id/menus', menuValidation, restaurantController.addMenu);
router.put('/:restaurantId/menus/:menuId', menuValidation, restaurantController.updateMenu);
router.delete('/:restaurantId/menus/:menuId', restaurantController.removeMenu);

// Route pour filtrer par catégorie
router.get('/category/:category', restaurantController.getRestaurantsByCategory);

module.exports = router;