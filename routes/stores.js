const express = require('express');
const {
  getStore,
  getStores,
  updateStore,
  createStore,
  deleteStore,
  getStoreByRadius
} = require('../controllers/stores');
/** Other Resources Routes */
const projectRouter = require('./projects');

/** Initialize Router */
const router = express.Router();

/** Re-route Resoureces to other routers */
router.use('/:stotreId/projects', projectRouter);

/** Store Routes */
router.route('/radius/:zipcode/:distance').get(getStoreByRadius);
router
  .route('/')
  .get(getStores)
  .post(createStore);

router
  .route('/:id')
  .get(getStore)
  .put(updateStore)
  .delete(deleteStore);

module.exports = router;
