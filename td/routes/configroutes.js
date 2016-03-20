'use strict';

var express = require('express');
var home = require('../controllers/homecontroller');
var github = require('../controllers/githublogincontroller');
var router = express.Router();

//main application entry point
router.get('/', home.index);

//github sign in
router.get('/login', github.login);
router.get('/login/github', github.doLogin);
router.get('/oauth/github', github.doLogin, github.setIDP);
router.get('/profile', github.ensureLoggedIn, github.profile);
router.get('/logout', github.logout);

module.exports = router;
