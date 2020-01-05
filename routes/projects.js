const express = require('express');
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject
} = require('../controllers/projects');
const Project = require('../models/Project');
const filterQuery = require('../middleware/filter');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    filterQuery(Project, {
      path: 'store',
      select: 'name description engineers'
    }),
    getProjects
  )
  .post(protect, authorize('admin', 'owner'), createProject);
router
  .route('/:id')
  .get(getProject)
  .put(protect, authorize('admin', 'owner'), updateProject)
  .delete(protect, authorize('admin', 'owner'), deleteProject);
module.exports = router;
