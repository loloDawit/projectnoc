const express = require('express');
const {
  getStore,
  getStores,
  updateStore,
  createStore,
  deleteStore,
  getStoreByRadius
} = require('../controllers/stores');
const router = express.Router();

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
