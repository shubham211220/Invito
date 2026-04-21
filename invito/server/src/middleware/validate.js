const { validationResult } = require('express-validator');
const ApiResponse = require('../utils/apiResponse');

/**
 * Middleware to check express-validator results.
 * Returns 422 with validation errors if any exist.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    return ApiResponse.validationError(res, formattedErrors);
  }
  next();
};

module.exports = validate;
