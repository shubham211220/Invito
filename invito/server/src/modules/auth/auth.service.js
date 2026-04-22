const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../user/user.model');
const env = require('../../config/env');

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

class AuthService {
  /**
   * Register a new user with email/password.
   */
  async register({ name, email, password }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('An account with this email already exists.');
      error.statusCode = 409;
      throw error;
    }

    const user = await User.create({ name, email, password, provider: 'email' });
    const token = this.generateToken(user._id);

    return { user, token };
  }

  /**
   * Login an existing user with email/password.
   */
  async login({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    // If user signed up with Google and has no password
    if (!user.password && user.provider === 'google') {
      const error = new Error('This account uses Google Sign-In. Please use the "Continue with Google" button.');
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
   * Google OAuth login/signup.
   * Verifies the Google ID token and finds or creates a user.
   */
  async googleLogin({ idToken }) {
    // Verify the token with Google
    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (err) {
      const error = new Error('Invalid Google token.');
      error.statusCode = 401;
      throw error;
    }

    const { sub: googleId, email, name, picture } = payload;

    // Try to find by googleId first, then by email
    let user = await User.findOne({ googleId });

    if (!user) {
      // Check if a user with this email already exists (email signup)
      user = await User.findOne({ email });

      if (user) {
        // Link Google account to existing email account
        user.googleId = googleId;
        if (picture && !user.profileImage) user.profileImage = picture;
        if (!user.avatar && picture) user.avatar = picture;
        await user.save();
      } else {
        // Create a brand new user
        user = await User.create({
          name: name || email.split('@')[0],
          email,
          googleId,
          provider: 'google',
          profileImage: picture || '',
          avatar: picture || '',
        });
      }
    } else {
      // Update profile image if changed
      if (picture && user.profileImage !== picture) {
        user.profileImage = picture;
        if (!user.avatar) user.avatar = picture;
        await user.save();
      }
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
