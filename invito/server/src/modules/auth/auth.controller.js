const authService = require('./auth.service');
const ApiResponse = require('../../utils/apiResponse');

class AuthController {
  /**
   * POST /api/auth/register
   */
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const { user, token } = await authService.register({ name, email, password });
      return ApiResponse.created(res, { user, token }, 'Account created successfully!');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/login
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { user, token } = await authService.login({ email, password });
      return ApiResponse.success(res, { user, token }, 'Logged in successfully!');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/google
   * Handles Google OAuth ID token verification and login/signup.
   */
  async googleLogin(req, res, next) {
    try {
      const { idToken } = req.body;
      if (!idToken) {
        return ApiResponse.error(res, 'Google ID token is required.', 400);
      }
      const { user, token } = await authService.googleLogin({ idToken });
      return ApiResponse.success(res, { user, token }, 'Signed in with Google successfully!');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/me
   */
  async getMe(req, res, next) {
    try {
      const user = await authService.getProfile(req.user._id);
      return ApiResponse.success(res, { user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/auth/profile
   */
  async updateProfile(req, res, next) {
    try {
      const user = await authService.updateProfile(req.user._id, req.body);
      return ApiResponse.success(res, { user }, 'Profile updated successfully!');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
