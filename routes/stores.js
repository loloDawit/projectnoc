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
  .get(getStores)
  .post(createStore);
router.route('/:id/photo').put(uploadStorePhoto)
router
  .route('/:id')
  .get(getStore)
  .put(updateStore)
  .delete(deleteStore);

module.exports = router;
