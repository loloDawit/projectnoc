/**
 * * Middleware to Protect Private Routes
 */

const JSONWebToken = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/Users');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  console.log(req.headers.authorization);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // else if(req.cookies.token){
  //     token = req.cookies.token
  // }
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route ', 401));
  }

  try {
    const decoded = JSONWebToken.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return next(new ErrorResponse('Not authorized to access this route ', 401));
  }
});
