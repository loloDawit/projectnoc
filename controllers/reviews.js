const Store = require('../models/Store');
const Review = require('../models/Review');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

/**
 **  getReviews
 *
 * @Description Get all reviews
 * @Route       GET /api/v1/reviews
 * @Route       GET /api/v1/stores/:storeId/reviews
 * @Access      Public
 */
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.storeId) {
    const reviews = await Review.find({ store: req.params.storeId });
    return res.status(200).json({
      success: true,
      total_project: reviews.length,
      data: reviews
    });
  } else {
    res.status(200).json(res.filterQuery);
  }
});
/**
 **  getReview
 *
 * @Description Get a review using the store id
 * @Route       GET /api/v1/reviews/:id
 * @Access      Public
 */
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'store',
    select: 'name description'
  });
  if (!review) {
    return next(
      new ErrorResponse(
        `No review found with the id of '${req.params.id}'`,
        404
      )
    );
  }
  res.status(200).json({
    success: true,
    data: review
  });
});
/**
 **  createReview
 *
 * @Description Create a new review
 * @Route       POST /api/v1/stores/:storeId/reviews
 * @Access      Private
 */
exports.createReview = asyncHandler(async (req, res, next) => {
  req.body.store = req.params.storeId;
  req.body.user = req.user.id;

  const store = await Store.findById(req.params.storeId);
  if (!store) {
    return next(
      new ErrorResponse(
        `Store not found with an id of ${req.params.storeId}`,
        404
      )
    );
  }
  const review = await Review.create(req.body);

  res.status(200).json({
    success: true,
    data: review
  });
});
