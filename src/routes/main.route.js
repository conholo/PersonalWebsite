const express = require('express');
const router =  express.Router();

const mainController = require('../controllers/main.controller');

router.get("/", mainController.get_home_page);

module.exports = router;