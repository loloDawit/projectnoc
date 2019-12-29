const Project = require('../models/Project');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc        GET ProjectS
// @route       GET /api/v1/projects
// @route       GET /api/v1/stores/:storeId/projects
// @access      Public
exports.getProjects = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.storeId) {
    query = Project.find({ store: req.params.storeId });
  } else {
    query = Project.find().populate({
      path: 'store',
      select: 'name description engineers'
    });
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
