const User = require('../user/user.model');
const Invitation = require('../invitation/invitation.model');
const RSVP = require('../rsvp/rsvp.model');
const ApiResponse = require('../../utils/apiResponse');

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const premiumUsers = await User.countDocuments({ plan: 'premium' });
    const totalInvitations = await Invitation.countDocuments();
    const totalRsvps = await RSVP.countDocuments();

    return ApiResponse.success(res, {
      stats: {
        totalUsers,
        premiumUsers,
        totalInvitations,
        totalRsvps,
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return ApiResponse.error(res, 'Failed to fetch admin statistics', 500);
  }
};

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
exports.getUsers = async (req, res) => {
  try {
    // Sort by newest first
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, { users });
  } catch (error) {
    console.error('Admin getUsers error:', error);
    return ApiResponse.error(res, 'Failed to fetch users', 500);
  }
};

/**
 * @desc    Get all invitations
 * @route   GET /api/admin/invitations
 * @access  Private/Admin
 */
exports.getInvitations = async (req, res) => {
  try {
    const invitations = await Invitation.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, { invitations });
  } catch (error) {
    console.error('Admin getInvitations error:', error);
    return ApiResponse.error(res, 'Failed to fetch invitations', 500);
  }
};

/**
 * @desc    Get all successful payments (premium users with paymentId)
 * @route   GET /api/admin/payments
 * @access  Private/Admin
 */
exports.getPayments = async (req, res) => {
  try {
    const usersWithPayments = await User.find({ paymentId: { $ne: null } })
      .select('name email plan paymentId orderId planExpiresAt createdAt')
      .sort({ updatedAt: -1 });

    return ApiResponse.success(res, { payments: usersWithPayments });
  } catch (error) {
    console.error('Admin getPayments error:', error);
    return ApiResponse.error(res, 'Failed to fetch payments', 500);
  }
};
