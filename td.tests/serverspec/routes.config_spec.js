'use strict';

var jasmine = require('jasmine');
var mockery = require('mockery');
var request = require('supertest');
var express = require('express');
var finish_test = require('./helpers/supertest-jasmine');

describe('route config tests', function() {
    
    var app;

    //csrf mockery
    var mockCsrfProtectionContainer = {
        mockCsrfProtection: function(req, res, next) {
            next();
        }
    };
    
    var mockCsurf = function() { return mockCsrfProtectionContainer.mockCsrfProtection; };
    
    beforeEach(function() {
        
        mockery.enable({useCleanCache: true});
        mockery.warnOnUnregistered(false);
        mockery.warnOnReplace(false);
        mockery.registerMock('csurf', mockCsurf);
        app = express();
        
    });
    
    afterEach(function() {
    
        mockery.disable();
    
    });
    
    describe('home controller routes', function() {
        
        var indexBody = 'called home controller index';
        var logoutBody = 'called home controller logout';
        var loginBody = 'called home controller login';
        var logoutFormBody = 'called home controller logoutform';
        var mockHomeController;
        var mockGithub
        
        beforeEach(function() {

            mockHomeController = {};
   
            mockHomeController.ensureLoggedIn = function(req, res, next) {
                next();
            };        
            
            mockHomeController.login = function(req, res, next) {
                res.status(200).send(loginBody);
            }
            
            mockHomeController.index = function(req, res, next) {
                res.status(200).send(indexBody);
            };
            
            mockHomeController.logout = function(req, res, next) {
                res.status(200).send(logoutBody);
            };

            mockHomeController.logoutform = function(req, res, next) {
                res.status(200).send(logoutFormBody);
            };      
                 
            mockery.registerMock('../controllers/homecontroller', mockHomeController);
            
        });
        
        it('/', function(done) {
                  
            mockHomeController.index = function(req, res, next) {
                expect(mockCsrfProtectionContainer.mockCsrfProtection).toHaveBeenCalled();
                expect(mockHomeController.ensureLoggedIn).toHaveBeenCalled();
                expect(mockHomeController.index).toHaveBeenCalled();
                res.status(200).send(indexBody);
            };

            spyOn(mockCsrfProtectionContainer, 'mockCsrfProtection').and.callThrough();
            spyOn(mockHomeController, 'ensureLoggedIn').and.callThrough();
            spyOn(mockHomeController, 'index').and.callThrough();

            require('../../td/config/routes.config')(app);
                   
            request(app)
                .get('/')
                .expect(200)
                .expect(indexBody)
                .end(finish_test(done));
        });
        
        it('/login', function(done){
            
            mockHomeController.logout = function(req, res, next) {
                expect(mockCsrfProtectionContainer.mockCsrfProtection).toHaveBeenCalled();
                expect(mockHomeController.login).toHaveBeenCalled();
                res.status(200).send(loginBody);
            };
                        
            spyOn(mockCsrfProtectionContainer, 'mockCsrfProtection').and.callThrough();
            spyOn(mockHomeController, 'login').and.callThrough();
            
            require('../../td/config/routes.config')(app);
            
            request(app)
                .get('/login')
                .expect(200)
                .expect(loginBody)
                .end(finish_test(done));
        });
        
        it('/logout', function(done){
            
            mockHomeController.logout = function(req, res, next) {
                expect(mockCsrfProtectionContainer.mockCsrfProtection).toHaveBeenCalled();
                expect(mockHomeController.logout).toHaveBeenCalled();
                res.status(200).send(logoutBody);
            };
                        
            spyOn(mockCsrfProtectionContainer, 'mockCsrfProtection').and.callThrough();
            spyOn(mockHomeController, 'logout').and.callThrough();
            
            require('../../td/config/routes.config')(app);
            
            request(app)
                .post('/logout')
                .expect(200)
                .expect(logoutBody)
                .end(finish_test(done));
        });
        
        it('/logoutform', function(done){
            
            mockHomeController.logoutForm = function(req, res, next) {
                expect(mockCsrfProtectionContainer.mockCsrfProtection).toHaveBeenCalled();
                expect(mockHomeController.logoutForm).toHaveBeenCalled();
                res.status(200).send(logoutFormBody);
            };
                        
            spyOn(mockCsrfProtectionContainer, 'mockCsrfProtection').and.callThrough();
            spyOn(mockHomeController, 'logoutform').and.callThrough();
            
            require('../../td/config/routes.config')(app);
            
            request(app)
                .get('/logoutform')
                .expect(200)
                .expect(logoutFormBody)
                .end(finish_test(done));
        }); 
    });
    
    describe('github signin routes', function() {
        
        var doLoginBody = 'called doLogin';
        var completeLoginBody = 'called completeLogin';
        var mockGithub;
        
        beforeEach(function() {
            
            mockGithub = {};
                       
            mockGithub.doLogin = function(req, res, next) {
                res.status(200).send(doLoginBody);
            };
            
            mockGithub.completeLogin = function(req, res, next) {
                res.status(200).send(completeLoginBody);
            };

            mockery.registerMock('../controllers/githublogincontroller', mockGithub);
            spyOn(mockCsrfProtectionContainer, 'mockCsrfProtection').and.callThrough();           
            
        });
        
        it('/login', function(done){
            
            spyOn(mockGithub, 'doLogin').and.callThrough();
            require('../../td/config/routes.config')(app);
            
            request(app)
                .post('/login')
                .expect(200)
                .expect(doLoginBody)
                .expect(function(res) {
                    expect(mockGithub.doLogin).toHaveBeenCalled();
                    expect(mockCsrfProtectionContainer.mockCsrfProtection).toHaveBeenCalled();
                })
                .end(finish_test(done));
            
        });  
        
        it('/login/github', function(done){
            
            spyOn(mockGithub, 'doLogin').and.callThrough();
            require('../../td/config/routes.config')(app);
            
            request(app)
                .get('/login/github')
                .expect(200)
                .expect(doLoginBody)
                .expect(function(res) {
                    expect(mockGithub.doLogin).toHaveBeenCalled();
                })
                .end(finish_test(done));
            
        });
        
        it('/oauth/github', function(done){
            
            spyOn(mockGithub, 'doLogin').and.callFake(function(req, res, next) {
                next();
            });
            
            spyOn(mockGithub, 'completeLogin').and.callThrough();
            
            require('../../td/config/routes.config')(app);
            
            request(app)
                .get('/oauth/github')
                .expect(200)
                .expect(completeLoginBody)
                .expect(function(res) {
                    expect(mockGithub.doLogin).toHaveBeenCalled();
                    expect(mockGithub.completeLogin).toHaveBeenCalled();
                })
                .end(finish_test(done));
            
        });        
    });
});
