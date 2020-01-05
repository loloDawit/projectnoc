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

/** Initialize Router */
const router = express.Router();

/** Re-route Resoureces to other routers */
router.use('/:storeId/projects', projectRouter);

/** Store Routes */
router.route('/radius/:zipcode/:distance').get(getStoreByRadius);
router
  .route('/')
  .get(filterQuery(Store, 'projects'), getStores)
  .post(protect, authorize('admin'), createStore);
router.route('/:id/photo').put(protect, authorize('admin'), uploadStorePhoto);
router
  .route('/:id')
  .get(getStore)
  .put(protect, authorize('admin'), updateStore)
  .delete(protect, authorize('admin'), deleteStore);

module.exports = router;
