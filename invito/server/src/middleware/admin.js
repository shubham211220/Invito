const ApiResponse = require('../utils/apiResponse');

/**
 * Admin authorization middleware.
 * Must be used AFTER the `auth` middleware.
 * Checks if req.user has the 'admin' role.
 */
const admin = (req, res, next) => {
  if (!req.user) {
    return ApiResponse.unauthorized(res, 'Access denied. User not authenticated.');
  }

  if (req.user.role !== 'admin') {
    return ApiResponse.error(res, 'Access denied. Requires administrator privileges.', 403);
  }

  next();
};

module.exports = admin;
