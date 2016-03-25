'use strict';

var express = require('express');
var home = require('../controllers/homecontroller');
var github = require('../controllers/githublogincontroller');
var router = express.Router();

module.exports = function(app) {
    
    //main application entry point
    router.get('/', home.index);

    //github sign in
    router.get('/login', github.startLogin, github.doLogin);
    router.get('/login/github', github.doLogin);
    router.get('/oauth/github', github.doLogin, github.setIDP);
    router.get('/profile', github.ensureLoggedIn, github.profile);
    router.get('/logout', github.logout);
    
    app.use('/', router);
};

