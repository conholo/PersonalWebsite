const express = require('express');
const router =  express.Router();

const projectsController = require('../controllers/projects.controller');

router.get("/", projectsController.get_projects_page);
router.get("/pathfinder", projectsController.get_pathfinder_page);

module.exports = router;