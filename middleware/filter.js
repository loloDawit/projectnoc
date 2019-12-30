const filterQuery = (model, populate) => async (req, res, next) => {
  const reqQuery = { ...req.query };
  let query;

  const removeFields = ['select', 'sort', 'page', 'limit'];
  removeFields.forEach(param => {
    delete reqQuery[param];
  });
  let queryString = JSON.stringify(reqQuery);
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    match => `$${match}`
  );

  query = model.find(JSON.parse(queryString));
  // SELECT fields
  if (req.query.select) {
    // query select takes the values with space
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }
  // SORT query by date
  if (req.query.sort) {
    const sortBy = req.query.select.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }
  // Add pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const _index = (page - 1) * limit;
  const _endIndex = page * limit;
  const _total = await model.countDocuments();

  query = query.skip(_index).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  /**              Execute Query              */
  const queryResult = await query;
  // Pagination result
  const pagination = {};
  if (_endIndex < _total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }
  if (_index > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }
  res.filterQuery = {
    success: true,
    total: queryResult.length,
    pagination,
    data: queryResult
  };
  next();
};

module.exports = filterQuery;
