const mongoose = require('mongoose');
const encrypt = require('bcryptjs');
const JsonWebToken = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    trim: true,
    maxlength: [15, 'Name can not be more than 50 characters']
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone number can be longer than 20 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please use a valid email'
    ]
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'owner'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minimumLength: 8,
    select: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});
/**
 * ! Encrypt User's Password
 */
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await encrypt.genSalt(10);
  this.password = await encrypt.hash(this.password, salt);
});
/**
 * TODO Sigin users using a token and JsonWebToken
 *
 */
UserSchema.methods.getSignedJSONWebToken = function() {
  return JsonWebToken.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_DATE
  });
};
/**
 * ! Match user's password saved in the database which is already hashed
 */
UserSchema.methods.validateHashedPassword = async function(password) {
  return await encrypt.compare(password, this.password);
};
/**
 * ! Reset password
 */
UserSchema.methods.getPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(20).toString('hex'); // generate token
  // hash it
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  // set expire
  this.resetPasswordExpire = Date.now() + 5 * 60 * 1000;
  return resetToken;
};
module.exports = mongoose.model('User', UserSchema);
