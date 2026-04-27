const userService = require('./user.service');
const ApiResponse = require('../../utils/apiResponse');

class UserController {
  /**
   * GET /api/users/profile
   */
  async getProfile(req, res, next) {
    try {
      const user = await userService.getProfile(req.user._id);
      return ApiResponse.success(res, { user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/users/upgrade
   */
  async upgradePlan(req, res, next) {
    try {
      const user = await userService.upgradePlan(req.user._id);
      return ApiResponse.success(res, { user }, 'Upgraded to Premium! 🎉');
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/users/downgrade
   */
  async downgradePlan(req, res, next) {
    try {
      const user = await userService.downgradePlan(req.user._id);
      return ApiResponse.success(res, { user }, 'Switched to Free plan.');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
