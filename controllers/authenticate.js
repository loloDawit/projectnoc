const Project = require('../models/Project');
const Store = require('../models/Store');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

/**
 * * Description    Register user
 * * Route          GET /api/v1/auth/register
 * * Access         Public
 */
exports.registerUser = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    test: 'Welcome'
  });
});
