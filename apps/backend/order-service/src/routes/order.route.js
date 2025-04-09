const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

// Routes CRUD de base
router.post('/', orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);

// Route pour mettre à jour le statut d'une commande
router.patch('/:id/status', orderController.updateOrderStatus);

// Routes pour récupérer les commandes par acteur
router.get('/client/:clientId', orderController.getClientOrders);
router.get('/restaurant/:restaurantId', orderController.getRestaurantOrders);
router.get('/delivery/:deliveryPersonId', orderController.getDeliveryPersonOrders);

module.exports = router;
