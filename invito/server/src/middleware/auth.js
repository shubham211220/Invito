const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiResponse = require('../utils/apiResponse');
const User = require('../modules/user/user.model');

/**
 * JWT authentication middleware.
 * Extracts token from Authorization header (Bearer <token>)
 * and attaches the user to req.user.
 */
const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ApiResponse.unauthorized(res, 'Access denied. No token provided.');
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return ApiResponse.unauthorized(res, 'User not found. Token invalid.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return ApiResponse.unauthorized(res, 'Invalid token.');
    }
    if (error.name === 'TokenExpiredError') {
      return ApiResponse.unauthorized(res, 'Token expired.');
    }
    return ApiResponse.error(res, 'Authentication failed.');
  }
};

module.exports = auth;
