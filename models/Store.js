const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

const StoreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name can not be more than 50 characters']
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please add a store description'],
    maxlength: [500, 'Discription can not be more than 500 characters']
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL'
    ]
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone number can be longer than 20 characters']
  },
  email: {
    type: String,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please use a valid email'
    ]
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: false
    },
    coordinates: {
      type: [Number],
      required: false,
      index: '2dsphere'
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String
  },
  engineers: {
    type: [String],
    required: true,
    enum: [
      'Mobile Developer',
      'Backend Developer',
      'Frontend Developer',
      'Network Engineer',
      'Data Scientist',
      'Store Admin',
      'Other'
    ]
  },
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [10, 'Rating must not be more than 10']
  },
  averageRevenue: Number,
  photo: {
    type: String,
    default: 'no-photo.jpg'
  },
  establishedat: {
    type: Date,
    default: Date.now
  },
  isFlagship: {
    type: Boolean,
    default: false
  }
});
/** Creat a Store Slug from the name */
StoreSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

/** Geocode and Create location field */
StoreSchema.pre('save', async function(next) {
  const _location = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [_location[0].longitude, _location[0].latitude],
    formattedAddress: _location[0].formattedAddress,
    street: _location[0].streetName,
    city: _location[0].city,
    state: _location[0].stateCode,
    zipcode: _location[0].zipcode,
    country: _location[0].countryCode
  };
  // We have the address geocoded, no need to save the address in the database
  this.address = undefined;
  next();
});
module.exports = mongoose.model('Store', StoreSchema);
