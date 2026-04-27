const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');

// All admin routes are strictly protected by BOTH auth and admin middlewares
router.use(auth, admin);

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getUsers);
router.get('/invitations', adminController.getInvitations);
router.get('/payments', adminController.getPayments);

module.exports = router;
