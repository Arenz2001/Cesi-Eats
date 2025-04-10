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

// Routes
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.get('/me', authMiddleware, authController.getCurrentUser);

// Verification endpoint for auth_request in nginx
router.get('/verify', authMiddleware, (req, res) => {
  // If authMiddleware passes, user is authenticated
  res.status(200).send();
});

module.exports = router;