const jwt = require('jsonwebtoken');
const User = require('../user/user.model');
const env = require('../../config/env');

class AuthService {
  /**
   * Register a new user.
   */
  async register({ name, email, password }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('An account with this email already exists.');
      error.statusCode = 409;
      throw error;
    }

    const user = await User.create({ name, email, password });
    const token = this.generateToken(user._id);

    return { user, token };
  }

  /**
   * Login an existing user.
   */
  async login({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const token = this.generateToken(user._id);

    return { user, token };
  }

  /**
   * Get current user profile.
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
   * Update user profile.
   */
  async updateProfile(userId, updates) {
    const user = await User.findByIdAndUpdate(
      userId,
      { name: updates.name, avatar: updates.avatar },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  /**
   * Generate JWT token.
   */
  generateToken(userId) {
    return jwt.sign({ id: userId }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });
  }
}

module.exports = new AuthService();
