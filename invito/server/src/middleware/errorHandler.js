const ApiResponse = require('../utils/apiResponse');

/**
 * Global error handling middleware.
 * Catches all unhandled errors and returns standardized response.
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return ApiResponse.validationError(res, errors);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return ApiResponse.error(res, `A record with this ${field} already exists.`, 409);
  }

  // Mongoose cast error (bad ObjectId)
  if (err.name === 'CastError') {
    return ApiResponse.error(res, 'Invalid ID format.', 400);
  }

  // Multer file upload error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return ApiResponse.error(res, 'File too large. Maximum size is 5MB.', 400);
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return ApiResponse.error(res, 'Unexpected file field.', 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return ApiResponse.unauthorized(res, 'Invalid token.');
  }

  if (err.name === 'TokenExpiredError') {
    return ApiResponse.unauthorized(res, 'Token expired.');
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  return ApiResponse.error(res, message, statusCode);
};

module.exports = errorHandler;
