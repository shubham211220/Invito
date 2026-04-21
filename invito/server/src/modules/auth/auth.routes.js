const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { registerValidation, loginValidation } = require('./auth.validator');
const validate = require('../../middleware/validate');
const auth = require('../../middleware/auth');

// Public routes
router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);

// Protected routes
router.get('/me', auth, authController.getMe);
router.put('/profile', auth, authController.updateProfile);

module.exports = router;
