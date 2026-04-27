const express = require('express');
const router = express.Router();
const paymentController = require('./payment.controller');
const auth = require('../../middleware/auth');

// All payment routes require authentication
router.use(auth);

router.post('/create-order', paymentController.createOrder);
router.post('/verify-payment', paymentController.verifyPayment);

module.exports = router;
