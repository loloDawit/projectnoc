const express = require('express');
const {
  createProject,
  getProjects,
  getProject
} = require('../controllers/projects');
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getProjects)
  .post(createProject);
router.route('/:id').get(getProject);
module.exports = router;
