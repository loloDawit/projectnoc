const Store = require('../models/Store');
const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
/**
 * * Description Get all Stores
 * * Route       Get /api/v1/stores
 * * Access      Public
 */
exports.getStores = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.filterQuery);
});
/**
 * * Description Get a single store
 * * Route       GET /api/v1/stores/:id
 * * Access      Public
 */
exports.getStore = asyncHandler(async (req, res, next) => {
  const store = await Store.findById(req.params.id);
  if (!store) {
    return next(
      new ErrorResponse(`Store not found with the id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: store
  });
});
/**
 * * Description Create a new store
 * * Route       POST /api/v1/stores
 * * Access      Private
 */
exports.createStore = asyncHandler(async (req, res, next) => {
  // added user
  req.body.user = req.user.id;
  const checkPublished = await Store.findOne({ user: req.user.id });
  // if already published
  if (checkPublished && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already published a store.`,
        400
      )
    );
  }
  const store = await Store.create(req.body);

  res.status(200).json({
    success: true,
    data: store
  });
});
/**
 * * Description Update a store
 * * Route       PUT /api/v1/stores/:id
 * * Access      Private
 */
exports.updateStore = asyncHandler(async (req, res, next) => {
  let store = await Store.findById(req.params.id);
  if (!store) {
    return next(
      new ErrorResponse(`Store not found with the id of ${req.params.id}`, 404)
    );
  }
  console.log('printing....', store.user.id);

  // Check ownership
  if (store.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this store`,
        401
      )
    );
  }
  // finally
  store = await Store.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: store
  });
});
/**
 * * Description Delete a store
 * * Route       PUT /api/v1/stores/:id
 * * Access      Private
 */
exports.deleteStore = asyncHandler(async (req, res, next) => {
  const store = await Store.findById(req.params.id);
  if (!store) {
    return next(
      new ErrorResponse(`Store not found with the id of ${req.params.id}`, 404)
    );
  }
  // Check ownership
  if (store.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to delete this store`,
        401
      )
    );
  }
  store.remove();
  res.status(200).json({
    success: true,
    data: {}
  });
});
/**
 * * Description Upload a store image
 * * Route       PUT /api/v1/stores/:id/photo
 * * Access      Private
 */
exports.uploadStorePhoto = asyncHandler(async (req, res, next) => {
  const store = await Store.findById(req.params.id);
  if (!store) {
    return next(
      new ErrorResponse(`Store not found with the id of ${req.params.id}`, 404)
    );
  }
  // Check ownership
  if (store.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this store`,
        401
      )
    );
  }
  if (!req.files) {
    return next(new ErrorResponse('Please upload a file'));
  }
  const file = req.files.file;
  // validate the files if it;s an image
  // image files png, img, jpeg starts with image/
  if (!file.mimetype.startsWith('image')) {
    return next(
      new ErrorResponse(
        'File uploaded is not an image, please upload an image',
        404
      )
    );
  }
  // Limit the size of the image to be upload
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return new ErrorResponse(
      `Please upload an image less than ${env.MAX_FILE_UPLOAD}`
    );
  }
  // add custom image file name
  file.name = `img_${store._id}${path.parse(file.name).ext}`;
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async error => {
    if (error) {
      console.error(error);
      return next(new ErrorResponse('oops something happed', 500));
    }
    await Store.findByIdAndUpdate(req.params.id, {
      photo: file.name
    });
    res.status(200).json({
      success: true,
      data: `Image ${file.name} has been successfully added.`
    });
  });
});
/**
 * * Description Get a store within a given radius using the zip code as a reference
 * * Route       GET /api/v1/stores/radius/:zipcode/:id
 * * Access      Public
 */
exports.getStoreByRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  // Get the latitude and longitude from the geocoder
  const location = await geocoder.geocode(zipcode);
  const latitude = location[0].latitude;
  const longitude = location[0].longitude;

  // Calculate the radius
  // Earth Radius = 3,963 miles
  const radius = distance / 3963;

  const stores = await Store.find({
    location: { $geoWithin: { $centerSphere: [[longitude, latitude], radius] } }
  });
  if (!stores) {
    return next(
      new ErrorResponse(
        `Store not found with the id of ${req.params.zipcode}`,
        404
      )
    );
  }
  res.status(200).json({
    success: true,
    total_stores: stores.length,
    data: stores
  });
});
