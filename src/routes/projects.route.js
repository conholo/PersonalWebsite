const express = require('express');
const router =  express.Router();

const projectsController = require('../controllers/projects.controller');

router.get("/", projectsController.get_projects_page);
router.get("/pathfinder", projectsController.get_pathfinder_page);
router.get('/2D_engine', projectsController.get_2D_engine_page);
router.get('/cg_projects', projectsController.get_cg_projects_page);

module.exports = router;