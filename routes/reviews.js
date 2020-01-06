const express = require('express');
const { getReviews, getReview, createReview } = require('../controllers/reviews');
const Review = require('../models/Review');
const filterQuery = require('../middleware/filter');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    filterQuery(Review, {
      path: 'store',
      select: 'name description'
    }),
    getReviews
  ).post(protect, authorize('admin', 'owner'), createReview);
  router
  .route('/:id')
  .get(getReview);
//   .put(protect, authorize('admin', 'owner'), updateProject)
//   .delete(protect, authorize('admin', 'owner'), deleteProject);
module.exports = router;
