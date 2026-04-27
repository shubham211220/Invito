const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const auth = require('../../middleware/auth');

// All routes require authentication
router.use(auth);

router.get('/profile', userController.getProfile);
router.put('/upgrade', userController.upgradePlan);
router.put('/downgrade', userController.downgradePlan);

module.exports = router;
