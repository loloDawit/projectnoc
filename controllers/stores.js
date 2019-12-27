const Store = require('../models/Store');

// @desc        Get all Stores
// @route       Get /api/v1/stores
// @access      Public
exports.getStores = async (req, res, next) => {
  try {
    const stores = await Store.find();

    res.status(200).json({
      success: true,
      data: stores
    });
  } catch (error) {
    res.status(400).json({
      success: false
    });
  }
};

// @desc        Get a Single Store
// @route       Get /api/v1/stores/:id
// @access      Public
exports.getStore = async (req, res, next) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(400).json({
        success: false,
        Error: `${req.params.id}` + ' is not a valid store ID'
      });
    }
    res.status(200).json({
      success: true,
      data: store
    });
  } catch (error) {
    res.status(400).json({
      success: false
    });
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
    res.status(400).json({
      success: false
    });
  }
};

// @desc        Upadte a  Store
// @route       PUT /api/v1/stores/:id
// @access      Private
exports.updateStore = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Updated store ${req.params.id}` });
};

// @desc        Delete a  Store
// @route       DELETE /api/v1/stores/:id
// @access      Private
exports.deleteStore = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Deleted store ${req.params.id}` });
};
