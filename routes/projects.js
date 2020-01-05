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
const { protect } = require('../middleware/auth');
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
  .post(protect, createProject);
router
  .route('/:id')
  .get(getProject)
  .put(protect, updateProject)
  .delete(protect, deleteProject);
module.exports = router;
