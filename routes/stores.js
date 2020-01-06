const express = require('express');
const {
  getStore,
  getStores,
  updateStore,
  createStore,
  deleteStore,
  getStoreByRadius,
  uploadStorePhoto
} = require('../controllers/stores');

const Store = require('../models/Store');
const filterQuery = require('../middleware/filter');
const { protect, authorize } = require('../middleware/auth');

/** Other Resources Routes */
const projectRouter = require('./projects');
const reviewRouter = require('./reviews');
/** Initialize Router */
const router = express.Router();

/** Re-route Resoureces to other routers */
router.use('/:storeId/projects', projectRouter);
router.use('/:storeId/reviews', reviewRouter);

/** Store Routes */
router.route('/radius/:zipcode/:distance').get(getStoreByRadius);
router
  .route('/')
  .get(filterQuery(Store, 'projects'), getStores)
  .post(protect, authorize('admin', 'owner'), createStore);
router
  .route('/:id/photo')
  .put(protect, authorize('admin', 'owner'), uploadStorePhoto);
router
  .route('/:id')
  .get(getStore)
  .put(protect, authorize('admin', 'owner'), updateStore)
  .delete(protect, authorize('admin', 'owner'), deleteStore);

module.exports = router;
