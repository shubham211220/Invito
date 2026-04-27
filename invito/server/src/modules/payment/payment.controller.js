const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../user/user.model');
const env = require('../../config/env');
const ApiResponse = require('../../utils/apiResponse');

// Initialize Razorpay gracefully so it doesn't crash the server if keys are missing
let razorpay;
try {
  if (env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET,
    });
  }
} catch (err) {
  console.warn('⚠️ Razorpay keys are missing or invalid. Payment gateway is disabled.');
}

/**
 * @desc    Create a new Razorpay order
 * @route   POST /api/payment/create-order
 * @access  Private
 */
exports.createOrder = async (req, res) => {
  if (!razorpay) {
    return ApiResponse.error(res, 'Payment gateway is not configured on the server. Please contact support.', 503);
  }

  try {
    const amount = 2900; // ₹29 in paise
    const currency = 'INR';

    const options = {
      amount,
      currency,
      receipt: `receipt_order_${req.user.id}`,
    };

    const order = await razorpay.orders.create(options);

    return ApiResponse.success(res, { orderId: order.id, amount, currency }, 'Order created successfully');
  } catch (error) {
    console.error('Razorpay create order error:', error);
    return ApiResponse.error(res, 'Failed to create payment order', 500);
  }
};

/**
 * @desc    Verify Razorpay payment signature
 * @route   POST /api/payment/verify-payment
 * @access  Private
 */
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return ApiResponse.error(res, 'Missing payment verification details', 400);
    }

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Payment is verified, update user plan
      const user = await User.findById(req.user.id);

      if (!user) {
        return ApiResponse.error(res, 'User not found', 404);
      }

      user.plan = 'premium';
      user.paymentId = razorpay_payment_id;
      user.orderId = razorpay_order_id;

      // Calculate 1 year expiration date
      const expireDate = new Date();
      expireDate.setFullYear(expireDate.getFullYear() + 1);
      user.planExpiresAt = expireDate;

      await user.save();

      return ApiResponse.success(res, { user }, 'Payment verified successfully! You are now on the Premium plan.');
    } else {
      return ApiResponse.error(res, 'Invalid payment signature', 400);
    }
  } catch (error) {
    console.error('Razorpay verification error:', error);
    return ApiResponse.error(res, 'Failed to verify payment', 500);
  }
};
