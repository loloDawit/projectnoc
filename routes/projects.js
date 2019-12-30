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
  .post(createProject);
router
  .route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);
module.exports = router;
