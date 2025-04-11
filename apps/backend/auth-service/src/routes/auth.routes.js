const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Validation middleware
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['customer', 'developper', 'restaurant', 'delivery', 'commercial'])
];

//login 
const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

const updateEmailValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty() // Pour confirmer l'identité
];

const updatePasswordValidation = [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 })
];

const updateRestaurantIdValidation = [
  body('id_restaurant').notEmpty().withMessage('L\'ID restaurant est requis')
];

// Routes
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.get('/me', authMiddleware, authController.getCurrentUser);

// Routes pour la gestion du compte
router.put('/email', authMiddleware, updateEmailValidation, authController.updateEmail);
router.put('/password', authMiddleware, updatePasswordValidation, authController.updatePassword);
router.put('/restaurant-id', authMiddleware, updateRestaurantIdValidation, authController.updateRestaurantId);
router.delete('/user', authMiddleware, authController.deleteUser);

// Verification endpoint for auth_request in nginx
router.get('/verify', authMiddleware, (req, res) => {
  // If authMiddleware passes, user is authenticated
  res.status(200).send();
});

module.exports = router;