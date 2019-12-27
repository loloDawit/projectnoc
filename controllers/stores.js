// @desc        Get all Stores
// @route       Get /api/v1/stores
// @access      Public
exports.getStores = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Show all stores' });
};

// @desc        Get a Single Store
// @route       Get /api/v1/stores/:id
// @access      Public
exports.getStore = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Show store ${req.params.id}` });
};

// @desc        Create new Store
// @route       POST /api/v1/stores
// @access      Private
exports.createStore = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Created new stores' });
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
