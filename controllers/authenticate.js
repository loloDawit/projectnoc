const Project = require('../models/Project');
const Store = require('../models/Store');
const User = require('../models/Users');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

/**
 * * Description    Register user
 * * Route          GET /api/v1/auth/register
 * * Access         Public
 */
exports.registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Create new user
  const user = await User.create({
    name,
    email,
    password,
    role
  });
  // Create token
  const token = user.getSignedJSONWebToken();

  res.status(200).json({
    success: true,
    token
  });
});
