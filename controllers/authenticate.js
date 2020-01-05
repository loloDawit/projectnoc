const Project = require('../models/Project');
const Store = require('../models/Store');
const User = require('../models/Users');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

/**
 * * Description    Register user
 * * Route          POST /api/v1/auth/register
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
  // Create token and send
  sendTokenResponse(user, 200, res);
});
/**
 * * Description    Sign in registered users using the token
 * * Route          POST /api/v1/auth/login
 * * Access         Private
 */
exports.signInUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // check if email and password is right
  if (!email || !password) {
    return next(
      new ErrorResponse(
        'Validation failed, please check you have the correct password and email'
      ),
      400
    );
  }
  const user = await User.findOne({ email: email }).select('+password');
  if (!user) {
    return next(
      new ErrorResponse('Validation failed, Invalid password/email'),
      401
    );
  }
  // validate the password
  const _comparePassword = await user.validateHashedPassword(password);
  if (!_comparePassword) {
    return next(
      new ErrorResponse('Validation failed, Invalid password/email'),
      401
    );
  }
  //Create token and send
  sendTokenResponse(user, 200, res);
});

// Get token and create cookie
const sendTokenResponse = (user, statusCode, response) => {
  const token = user.getSignedJSONWebToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE_DATE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') {
    options.sercure = true;
  }
  response
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    });
};

/**
 * @description Get current logged in user
 * @route       POST /api/v1/auth/admin
 * @access      Private
 */
exports.getAdmin = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user
  });
});
