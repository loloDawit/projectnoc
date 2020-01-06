const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema({
  title: {
    type: String,
    trim: true,
    require: [true, 'Please provide a review title'],
    maxlength: 100
  },
  description: {
    type: String,
    require: [true, 'Please provde a review description'],
    maxlength: [500, 'Discription can not be more than 500 characters']
  },
  rating: {
    type: Number,
    required: [true, 'Please add a review 1-10']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  store: {
    type: mongoose.Schema.ObjectId,
    ref: 'Store',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});
// One review per user
ReviewSchema.index({ store: 1, user: 1 }, { unique: true });
module.exports = mongoose.model('Review', ReviewSchema);
