const express = require('express');
const { createProject, getProjects } = require('../controllers/projects');
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getProjects)
  .post(createProject);

module.exports = router;
