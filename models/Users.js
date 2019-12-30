const mongoose = require('mongoose');
const encrypt = require('bcryptjs');

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
    enum: ['user', 'admin'],
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
  const salt = await encrypt.genSalt(10);
  this.password = await encrypt.hash(this.password, salt);
});
module.exports = mongoose.model('User', UserSchema);
