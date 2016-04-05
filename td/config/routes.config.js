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
    
    //login/out
    router.get('/login', csrfProtection, home.login);
    router.get('/logoutform', csrfProtection, home.logoutform);
    router.post('/logout', csrfProtection, home.logout);

    //github sign in
    router.post('/login', csrfProtection, github.doLogin);
    router.get('/login/github', github.doLogin);
    router.get('/oauth/github', github.doLogin, github.completeLogin);
    router.get('/profile', github.ensureLoggedIn, github.profile);
    
    app.use('/', router);
};

