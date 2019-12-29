const Project = require('../models/Project');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

exports.getProjects = asyncHandler(async (req, res, body) => {
  let query;
  console.log(req.params.storeId);

  if (req.params.storeId) {
    query = Project.find({ store: req.params.storeId });
  } else {
    query = Project.find();
  }
  const projects = await query;

  res.status(200).json({
    success: true,
    total_project: projects.length,
    data: projects
  });
});
// @desc        Create new Project
// @route       POST /api/v1/project
// @access      Private
exports.createProject = asyncHandler(async (req, res, next) => {
  const project = await Project.create(req.body);

  res.status(200).json({
    success: true,
    data: project
  });
});
