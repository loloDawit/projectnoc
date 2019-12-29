const Project = require('../models/Project');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

/**
 **  getProjects
 *
 * * Description Get all projects
 * * Route       GET /api/v1/projects
 * * Route       GET /api/v1/stores/:storeId/projects
 * * Access      Public
 */
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
/**
 **  getProject
 *
 * * Description Get a project using the project id
 * * Route       GET /api/v1/projects/:id
 * * Access      Public
 */
exports.getProject = asyncHandler(async (req, res, next) => {
  console.log(req.params.id);

  const project = await Project.findById(req.params.id).populate({
    path: 'store',
    select: 'name description'
  });
  if (!project) {
    return next(
      ErrorResponse(`Project not found with the id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: project
  });
});
/**
 **  createProject
 *
 * * Description Create a new Project
 * * Route       POST /api/v1/project
 * * Access      Private
 */
exports.createProject = asyncHandler(async (req, res, next) => {
  const project = await Project.create(req.body);

  res.status(200).json({
    success: true,
    data: project
  });
});
// @desc        Get a Single Project
// @route       Get /api/v1/stores/:id
// @access      Public
