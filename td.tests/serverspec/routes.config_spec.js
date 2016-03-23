'use strict';

var jasmine = require('jasmine');
var mockery = require('mockery');
var request = require('supertest');
var express = require('express');
var finish_test = require('./helpers/supertest-jasmine');

describe('route config tests', function() {
    
    var app;
    
    beforeEach(function() {
        
        mockery.enable({useCleanCache: true});
        mockery.warnOnUnregistered(false);
        mockery.warnOnReplace(false);
        app = express();
        
    });
    
    afterEach(function() {
    
        mockery.disable();
    
    });
    
    describe('main application entry point', function() {
        
        var resultBody = 'called home controller';
        
        beforeEach(function() {
            
            var mockHomeController = {};
            mockHomeController.index = function(req, res, next) { 
                res.status(200).send(resultBody);
            };
            
            mockery.registerMock('../controllers/homecontroller', mockHomeController);
            app.use('/', require('../../td/config/routes.config'));
            
        });
        
        it('/', function(done) {
            
            request(app)
                .get('/')
                .expect(200)
                .expect(resultBody)
                .end(finish_test(done));
            
        });
    });
    
    describe('github signin routes', function() {
        
        var doLoginBody = 'called doLogin';
        var logoutBody = 'called logout';
        var setIDPBody = 'called setIDP';
        var profileBody = 'called profile';
        var mockGithub;
        
        beforeEach(function() {
            
            mockGithub = {};
            
            mockGithub.startLogin = function(req, res, next) {
                next();
            };
            
            mockGithub.ensureLoggedIn = function(req, res, next) {
                next();
            };
            
            mockGithub.doLogin = function(req, res, next) {
                res.status(200).send(doLoginBody);
            };
            
            mockGithub.setIDP = function(req, res, next) {
                res.status(200).send(setIDPBody);
            };
            
            mockGithub.profile = function(req, res, next) {
                res.status(200).send(profileBody);
            };
            
            mockGithub.logout = function(req, res, next) {
                res.status(200).send(logoutBody);
            };
            
            spyOn(mockGithub, 'startLogin').and.callThrough();
            spyOn(mockGithub, 'logout').and.callThrough();
            spyOn(mockGithub, 'setIDP').and.callThrough(); 
            mockery.registerMock('../controllers/githublogincontroller', mockGithub);
            
            
        });
        
        it('/login', function(done){
            
            spyOn(mockGithub, 'doLogin').and.callThrough();
            app.use('/', require('../../td/config/routes.config'));
            
            request(app)
                .get('/login')
                .expect(200)
                .expect(doLoginBody)
                .expect(function(res) {
                    expect(mockGithub.doLogin).toHaveBeenCalled();
                    expect(mockGithub.startLogin).toHaveBeenCalled();
                })
                .end(finish_test(done));
            
        });  
        
        it('/login/github', function(done){
            
            spyOn(mockGithub, 'doLogin').and.callThrough();
            
            app.use('/', require('../../td/config/routes.config'));
            
            request(app)
                .get('/login/github')
                .expect(200)
                .expect(doLoginBody)
                .expect(function(res) {
                    expect(mockGithub.doLogin).toHaveBeenCalled();
                    expect(mockGithub.startLogin).not.toHaveBeenCalled();
                })
                .end(finish_test(done));
            
        });
        
        it('/oauth/github', function(done){
            
            spyOn(mockGithub, 'doLogin').and.callFake(function(req, res, next) {
                next();
            });
            
            app.use('/', require('../../td/config/routes.config'));
            
            request(app)
                .get('/oauth/github')
                .expect(200)
                .expect(setIDPBody)
                .expect(function(res) {
                    expect(mockGithub.doLogin).toHaveBeenCalled();
                    expect(mockGithub.setIDP).toHaveBeenCalled();
                })
                .end(finish_test(done));
            
        });
        
        it('/logout', function(done){
            
            app.use('/', require('../../td/config/routes.config'));
            
            request(app)
                .get('/logout')
                .expect(200)
                .expect(logoutBody)
                .expect(function(res) {
                    expect(mockGithub.logout).toHaveBeenCalled();
                })
                .end(finish_test(done));
            
        }); 
        
    });
});
