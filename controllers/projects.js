const Project = require('../models/Project');
const Store = require('../models/Store');
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
  if (req.params.storeId) {
    const projects = await Project.find({ store: req.params.storeId });
    return res.status(200).json({
      success: true,
      total_project: projects.length,
      data: projects
    });
  } else {
    res.status(200).json(res.filterQuery);
  }
});
/**
 **  getProject
 *
 * * Description Get a project using the project id
 * * Route       GET /api/v1/projects/:id
 * * Access      Public
 */
exports.getProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id).populate({
    path: 'store',
    select: 'name description'
  });
  if (!project) {
    return next(
      new ErrorResponse(
        `Project not found with the id of ${req.params.id}`,
        404
      )
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
 * * Route       POST /api/v1/stores/:storeId/projects
 * * Access      Private
 */
exports.createProject = asyncHandler(async (req, res, next) => {
  req.body.store = req.params.storeId;
  req.body.user = req.user.id;

  const store = await Store.findById(req.params.storeId);
  if (!store) {
    return next(
      new ErrorResponse(
        `Store not found with an id of ${req.params.storeId}`,
        404
      )
    );
  }

  // Check ownership
  if (store.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to create a project to store ${store._id} `,
        401
      )
    );
  }
  const project = await Project.create(req.body);

  res.status(200).json({
    success: true,
    data: project
  });
});
/**
 **  updateProject
 *
 * * Description Update a Project details using the project id
 * * Route       PUT /api/v1/project/:id
 * * Access      Private
 */
exports.updateProject = asyncHandler(async (req, res, next) => {
  let project = await Project.findById(req.params.id);
  if (!project) {
    return next(
      new ErrorResponse(`Project not found with an id of ${req.params.id}`, 404)
    );
  }
  // Check ownership
  if (project.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update a project at store ${project._id} `,
        401
      )
    );
  }
  project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    success: true,
    data: project
  });
});
/**
 **  deleteProject
 *
 * * Description Delete a Project using the project id
 * * Route       PUT /api/v1/project/:id
 * * Access      Private
 */
exports.deleteProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return next(
      new ErrorResponse(`Project not found with an id of ${req.params.id}`, 404)
    );
  }
  // Check ownership
  if (project.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete a project at store ${project._id} `,
        401
      )
    );
  }
  await project.remove();
  res.status(200).json({
    success: true,
    data: {}
  });
});
