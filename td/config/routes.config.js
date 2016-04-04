'use strict';

var express = require('express');
var csrf = require('csurf');
var home = require('../controllers/homecontroller');
var github = require('../controllers/githublogincontroller');
var router = express.Router();

module.exports = function(app) {
    
    //anti csrf
    var csrfProtection = csrf();
    
    //main application entry point
    router.get('/', csrfProtection, github.ensureLoggedIn, home.index);
    router.get('/login', csrfProtection, home.login);

    //github sign in
    router.post('/login', csrfProtection, github.startLogin, github.doLogin);
    router.get('/login/github', github.doLogin);
    router.get('/oauth/github', github.doLogin, github.completeLogin);
    router.get('/profile', github.ensureLoggedIn, github.profile);
    router.post('/logout', csrfProtection, github.logout);
    
    app.use('/', router);
};

