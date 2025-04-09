const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/delivery.controller');

// Route pour créer un livreur
router.post('/delivery', deliveryController.createDelivery);

// Route pour récupérer un livreur par ID
router.get('/delivery/:id', deliveryController.getDeliveryById);

// Route pour récupérer le RIB d'un livreur par ID
router.get('/delivery/:id/rib', deliveryController.getDeliveryRibById);

// Route pour mettre à jour un livreur
router.put('/delivery/:id', deliveryController.updateDelivery);

// Route pour supprimer un livreur
router.delete('/delivery/:id', deliveryController.deleteDelivery);

module.exports = router; 