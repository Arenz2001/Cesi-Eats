const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Route pour créer un utilisateur
router.post('/users', userController.createUser);

// Route pour récupérer un utilisateur par ID d'authentification
router.get('/users/:id', userController.getUserById);

// Route pour mettre à jour un utilisateur
router.put('/users/:id', userController.updateUser);

// Route pour supprimer un utilisateur
router.delete('/users/:id', userController.deleteUser);

module.exports = router; 