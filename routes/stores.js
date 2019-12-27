const express = require('express');
const {
  getStore,
  getStores,
  updateStore,
  createStore,
  deleteStore
} = require('../controllers/stores');
const router = express.Router();

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
