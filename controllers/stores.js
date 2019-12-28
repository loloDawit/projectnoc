const Store = require('../models/Store');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
// @desc        Get all Stores
// @route       Get /api/v1/stores
// @access      Public
exports.getStores = asyncHandler(async (req, res, next) => {
  const reqQuery = { ...req.query };
  let query;

  const removeFields = ['select', 'sort', 'page', 'limit'];
  removeFields.forEach(param => {
    delete reqQuery[param];
  });
  let queryString = JSON.stringify(reqQuery);
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    match => `$${match}`
  );

  query = Store.find(JSON.parse(queryString));
  // SELECT fields
  if (req.query.select) {
    // query select takes the values with space
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }
  // SORT query by
  if (req.query.sort) {
    const sortBy = req.query.select.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-establishedat');
  }
  // Add pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const _index = (page - 1) * limit;
  const _endIndex = page * limit;
  const _total = await Store.countDocuments();

  query = query.skip(_index).limit(limit);

  /**              Execute Query              */
  const stores = await query;
  // Pagination result
  const pagination = {};
  if (_endIndex < _total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }
  if (_index > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }
  res.status(200).json({
    success: true,
    total_stores: stores.length,
    pagination,
    data: stores
  });
});

// @desc        Get a Single Store
// @route       Get /api/v1/stores/:id
// @access      Public
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

// @desc        Create new Store
// @route       POST /api/v1/stores
// @access      Private
exports.createStore = asyncHandler(async (req, res, next) => {
  const store = await Store.create(req.body);

  res.status(200).json({
    success: true,
    data: store
  });
});

// @desc        Upadte a  Store
// @route       PUT /api/v1/stores/:id
// @access      Private
exports.updateStore = asyncHandler(async (req, res, next) => {
  const store = await Store.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
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

// @desc        Delete a  Store
// @route       DELETE /api/v1/stores/:id
// @access      Private
exports.deleteStore = asyncHandler(async (req, res, next) => {
  const store = await Store.findByIdAndDelete(req.params.id);
  if (!store) {
    return next(
      new ErrorResponse(`Store not found with the id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc        Get a Store within a radius
// @route       GET /api/v1/stores/radius/:zipcode/:id
// @access      Private
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
