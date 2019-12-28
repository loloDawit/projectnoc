const Store = require('../models/Store');
const ErrorResponse = require('../utils/errorResponse');

// @desc        Get all Stores
// @route       Get /api/v1/stores
// @access      Public
exports.getStores = async (req, res, next) => {
  try {
    const stores = await Store.find();

    res.status(200).json({
      success: true,
      total_stores: stores.length,
      data: stores
    });
  } catch (error) {
    next(error);
  }
};

// @desc        Get a Single Store
// @route       Get /api/v1/stores/:id
// @access      Public
exports.getStore = async (req, res, next) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      return next(
        new ErrorResponse(
          `Store not found with the id of ${req.params.id}`,
          404
        )
      );
    }
    res.status(200).json({
      success: true,
      data: store
    });
  } catch (error) {
    next(error);
  }
};

// @desc        Create new Store
// @route       POST /api/v1/stores
// @access      Private
exports.createStore = async (req, res, next) => {
  try {
    const store = await Store.create(req.body);

    res.status(200).json({
      success: true,
      data: store
    });
  } catch (error) {
    next(error);
  }
};

// @desc        Upadte a  Store
// @route       PUT /api/v1/stores/:id
// @access      Private
exports.updateStore = async (req, res, next) => {
  try {
    const store = await Store.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!store) {
      return next(
        new ErrorResponse(
          `Store not found with the id of ${req.params.id}`,
          404
        )
      );
    }
    res.status(200).json({
      success: true,
      data: store
    });
  } catch (error) {
    next(error);
  }
};

// @desc        Delete a  Store
// @route       DELETE /api/v1/stores/:id
// @access      Private
exports.deleteStore = async (req, res, next) => {
  try {
    const store = await Store.findByIdAndDelete(req.params.id);
    if (!store) {
      return next(
        new ErrorResponse(
          `Store not found with the id of ${req.params.id}`,
          404
        )
      );
    }
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
