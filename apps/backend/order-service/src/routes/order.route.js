const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - clientId
 *         - restaurantId
 *         - items
 *         - totalPrice
 *       properties:
 *         clientId:
 *           type: string
 *           description: ID du client
 *         restaurantId:
 *           type: string
 *           description: ID du restaurant
 *         deliveryPersonId:
 *           type: string
 *           description: ID du livreur
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *               price:
 *                 type: number
 *         totalPrice:
 *           type: number
 *           description: Prix total de la commande
 *         status:
 *           type: string
 *           enum: [pending, accepted, preparing, ready, ready_for_delivery, delivering, delivered, cancelled]
 *           default: pending
 */

/**
 * @swagger
 * /orders/available:
 *   get:
 *     summary: Récupérer les commandes disponibles pour livraison
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Liste des commandes disponibles pour livraison
 */
router.get('/orders/available', orderController.getAvailableOrders);

/**
 * @swagger
 * /orders/{id}/accept:
 *   post:
 *     summary: Accepter une commande par un livreur
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la commande
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deliveryPersonId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Commande acceptée avec succès
 *       404:
 *         description: Commande non trouvée
 */
router.post('/orders/:id/accept', orderController.acceptOrder);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Créer une nouvelle commande
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Commande créée avec succès
 */
router.post('/orders', orderController.createOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Récupérer toutes les commandes
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Liste des commandes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
router.get('/orders', orderController.getAllOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Récupérer une commande par son ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la commande
 *     responses:
 *       200:
 *         description: Détails de la commande
 *       404:
 *         description: Commande non trouvée
 */
router.get('/orders/:id', orderController.getOrderById);

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Mettre à jour une commande
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la commande
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: Commande mise à jour avec succès
 *       404:
 *         description: Commande non trouvée
 */
router.put('/orders/:id', orderController.updateOrder);

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Supprimer une commande
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la commande
 *     responses:
 *       200:
 *         description: Commande supprimée avec succès
 *       404:
 *         description: Commande non trouvée
 */
router.delete('/orders/:id', orderController.deleteOrder);

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Mettre à jour le statut d'une commande
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la commande
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, accepted, preparing, ready, ready_for_delivery, delivering, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Statut de la commande mis à jour avec succès
 */
router.patch('/orders/:id/status', orderController.updateOrderStatus);

/**
 * @swagger
 * /orders/client/{clientId}:
 *   get:
 *     summary: Récupérer les commandes d'un client
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: clientId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du client
 *     responses:
 *       200:
 *         description: Liste des commandes du client
 */
router.get('/orders/client/:clientId', orderController.getClientOrders);

/**
 * @swagger
 * /orders/restaurant/{restaurantId}:
 *   get:
 *     summary: Récupérer les commandes d'un restaurant
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du restaurant
 *     responses:
 *       200:
 *         description: Liste des commandes du restaurant
 */
router.get('/orders/restaurant/:restaurantId', orderController.getRestaurantOrders);

/**
 * @swagger
 * /orders/delivery/{deliveryPersonId}:
 *   get:
 *     summary: Récupérer les commandes d'un livreur
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: deliveryPersonId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du livreur
 *     responses:
 *       200:
 *         description: Liste des commandes du livreur
 */
router.get('/orders/delivery/:deliveryPersonId', orderController.getDeliveryPersonOrders);

module.exports = router;
