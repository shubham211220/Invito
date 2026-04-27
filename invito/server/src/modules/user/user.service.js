const User = require('./user.model');

class UserService {
  /**
   * Get user profile with plan details.
   */
  async getProfile(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  /**
   * Upgrade user to premium (manual for now — Stripe integration later).
   */
  async upgradePlan(userId) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    user.plan = 'premium';
    user.planExpiresAt = null; // null = no expiry (lifetime for now)
    await user.save();

    return user;
  }

  /**
   * Downgrade user to free plan.
   */
  async downgradePlan(userId) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    user.plan = 'free';
    user.planExpiresAt = null;
    await user.save();

    return user;
  }
}

module.exports = new UserService();
