'use strict';

var jasmine = require('jasmine');
var mockery = require('mockery');
var request = require('supertest');
var express = require('express');
var finish_test = require('../supertest-jasmine');

describe('route config tests', function () {

    var app;

    //csrf mockery
    var mockCsrfProtectionContainer = {
        mockCsrfProtection: function (req, res, next) {
            next();
        }
    };

    var mockCsurf = function () { return mockCsrfProtectionContainer.mockCsrfProtection; };

    beforeEach(function () {

        mockery.enable({ useCleanCache: true });
        mockery.warnOnUnregistered(false);
        mockery.warnOnReplace(false);
        mockery.registerMock('csurf', mockCsurf);
        app = express();

    });

    afterEach(function () {

        mockery.disable();

    });

    afterAll(function () {
        mockery.deregisterAll();
    });

    describe('home controller routes', function () {

        var indexBody = 'called home controller index';
        var logoutBody = 'called home controller logout';
        var loginBody = 'called home controller login';
        var logoutFormBody = 'called home controller logoutform';
        var mockHomeController;
        var mockGithub

        beforeEach(function () {

            mockHomeController = {};

            mockHomeController.ensureLoggedIn = function (req, res, next) {
                next();
            };

            mockHomeController.login = function (req, res, next) {
                res.status(200).send(loginBody);
            }

            mockHomeController.index = function (req, res, next) {
                res.status(200).send(indexBody);
            };

            mockHomeController.logout = function (req, res, next) {
                res.status(200).send(logoutBody);
            };

            mockHomeController.logoutform = function (req, res, next) {
                res.status(200).send(logoutFormBody);
            };

            mockery.registerMock('../controllers/homecontroller', mockHomeController);

        });

        it('/', function (done) {

            mockHomeController.index = function (req, res, next) {
                expect(mockCsrfProtectionContainer.mockCsrfProtection).toHaveBeenCalled();
                expect(mockHomeController.ensureLoggedIn).toHaveBeenCalled();
                expect(mockHomeController.index).toHaveBeenCalled();
                res.status(200).send(indexBody);
            };

            spyOn(mockCsrfProtectionContainer, 'mockCsrfProtection').and.callThrough();
            spyOn(mockHomeController, 'ensureLoggedIn').and.callThrough();
            spyOn(mockHomeController, 'index').and.callThrough();

            require('../../../td/config/routes.config')(app);

            request(app)
                .get('/')
                .expect(200)
                .expect(indexBody)
                .end(finish_test(done));
        });

        it('/login', function (done) {

            mockHomeController.logout = function (req, res, next) {
                expect(mockCsrfProtectionContainer.mockCsrfProtection).toHaveBeenCalled();
                expect(mockHomeController.login).toHaveBeenCalled();
                res.status(200).send(loginBody);
            };

            spyOn(mockCsrfProtectionContainer, 'mockCsrfProtection').and.callThrough();
            spyOn(mockHomeController, 'login').and.callThrough();

            require('../../../td/config/routes.config')(app);

            request(app)
                .get('/login')
                .expect(200)
                .expect(loginBody)
                .end(finish_test(done));
        });

        it('/logout', function (done) {

            mockHomeController.logout = function (req, res, next) {
                expect(mockCsrfProtectionContainer.mockCsrfProtection).toHaveBeenCalled();
                expect(mockHomeController.logout).toHaveBeenCalled();
                res.status(200).send(logoutBody);
            };

            spyOn(mockCsrfProtectionContainer, 'mockCsrfProtection').and.callThrough();
            spyOn(mockHomeController, 'logout').and.callThrough();

            require('../../../td/config/routes.config')(app);

            request(app)
                .post('/logout')
                .expect(200)
                .expect(logoutBody)
                .end(finish_test(done));
        });

        it('/logoutform', function (done) {

            mockHomeController.logoutForm = function (req, res, next) {
                expect(mockCsrfProtectionContainer.mockCsrfProtection).toHaveBeenCalled();
                expect(mockHomeController.logoutForm).toHaveBeenCalled();
                res.status(200).send(logoutFormBody);
            };

            spyOn(mockCsrfProtectionContainer, 'mockCsrfProtection').and.callThrough();
            spyOn(mockHomeController, 'logoutform').and.callThrough();

            require('../../../td/config/routes.config')(app);

            request(app)
                .get('/logoutform')
                .expect(200)
                .expect(logoutFormBody)
                .end(finish_test(done));
        });
    });

    describe('github signin routes', function () {

        var doLoginBody = 'called doLogin';
        var completeLoginBody = 'called completeLogin';
        var mockGithub;

        beforeEach(function () {

            mockGithub = {};

            mockGithub.doLogin = function (req, res, next) {
                res.status(200).send(doLoginBody);
            };

            mockGithub.completeLogin = function (req, res, next) {
                res.status(200).send(completeLoginBody);
            };

            mockery.registerMock('../controllers/githublogincontroller', mockGithub);
            spyOn(mockCsrfProtectionContainer, 'mockCsrfProtection').and.callThrough();

        });

        it('/login', function (done) {

            spyOn(mockGithub, 'doLogin').and.callThrough();
            require('../../../td/config/routes.config')(app);

            request(app)
                .post('/login')
                .expect(200)
                .expect(doLoginBody)
                .expect(function (res) {
                    expect(mockGithub.doLogin).toHaveBeenCalled();
                    expect(mockCsrfProtectionContainer.mockCsrfProtection).toHaveBeenCalled();
                })
                .end(finish_test(done));

        });

        it('/login/github', function (done) {

            spyOn(mockGithub, 'doLogin').and.callThrough();
            require('../../../td/config/routes.config')(app);

            request(app)
                .get('/login/github')
                .expect(200)
                .expect(doLoginBody)
                .expect(function (res) {
                    expect(mockGithub.doLogin).toHaveBeenCalled();
                })
                .end(finish_test(done));

        });

        it('/oauth/github', function (done) {

            spyOn(mockGithub, 'doLogin').and.callFake(function (req, res, next) {
                next();
            });

            spyOn(mockGithub, 'completeLogin').and.callThrough();

            require('../../../td/config/routes.config')(app);

            request(app)
                .get('/oauth/github')
                .expect(200)
                .expect(completeLoginBody)
                .expect(function (res) {
                    expect(mockGithub.doLogin).toHaveBeenCalled();
                    expect(mockGithub.completeLogin).toHaveBeenCalled();
                })
                .end(finish_test(done));

        });
    });

    describe('threat model routes', function () {

        var reposBody = 'called repos';
        var branchesBody = 'called banches';
        var modelsBody = 'called models';
        var modelBody = 'called model';
        var deleteBody = 'called delete';
        var createBody = 'create';
        var updateBody = 'update';
        var mockThreatModel = {};
        var mockHomeController = {};

        beforeEach(function () {

            mockHomeController.ensureLoggedIn = function (req, res, next) {
                next();
            };

            mockHomeController.login = function () { };

            mockHomeController.index = function () { };

            mockHomeController.logout = function () { };

            mockHomeController.logoutform = function () { };

            mockThreatModel.repos = function (req, res, next) {
                res.status(200).send(reposBody);
            };

            mockThreatModel.branches = function (req, res, next) {
                res.status(200).send(branchesBody);
            };

            mockThreatModel.models = function (req, res, next) {
                res.status(200).send(modelsBody);
            };

            mockThreatModel.model = function (req, res, next) {
                res.status(200).send(modelBody);
            };

            mockThreatModel.deleteModel = function (req, res, next) {
                res.status(200).send(deleteBody);
            };

            mockThreatModel.create = function (req, res, next) {
                res.status(200).send(createBody);
            };

            mockThreatModel.update = function (req, res, next) {
                res.status(200).send(updateBody);
            };

            mockery.registerMock('../controllers/threatmodelcontroller', mockThreatModel);
            mockery.registerMock('../controllers/homecontroller', mockHomeController);
            spyOn(mockCsrfProtectionContainer, 'mockCsrfProtection').and.callThrough();

        });

        it('/threatmodel/repos', function (done) {

            spyOn(mockThreatModel, 'repos').and.callThrough();
            spyOn(mockHomeController, 'ensureLoggedIn').and.callThrough();
            require('../../../td/config/routes.config')(app);

            request(app)
                .get('/threatmodel/repos')
                .expect(200)
                .expect(reposBody)
                .expect(function (res) {
                    expect(mockHomeController.ensureLoggedIn).toHaveBeenCalled();
                    expect(mockThreatModel.repos).toHaveBeenCalled();
                })
                .end(finish_test(done));

        });

        it('/threatmodel/org/repo/branches', function (done) {

            spyOn(mockThreatModel, 'branches').and.callThrough();
            spyOn(mockHomeController, 'ensureLoggedIn').and.callThrough();
            require('../../../td/config/routes.config')(app);

            request(app)
                .get('/threatmodel/org/repo/branches')
                .expect(200)
                .expect(branchesBody)
                .expect(function (res) {
                    expect(mockHomeController.ensureLoggedIn).toHaveBeenCalled();
                    expect(mockThreatModel.branches).toHaveBeenCalled();
                })
                .end(finish_test(done));

        });

        it('/threatmodel/org/repo/branch/models', function (done) {

            spyOn(mockThreatModel, 'models').and.callThrough();
            spyOn(mockHomeController, 'ensureLoggedIn').and.callThrough();
            require('../../../td/config/routes.config')(app);

            request(app)
                .get('/threatmodel/org/repo/branch/models')
                .expect(200)
                .expect(modelsBody)
                .expect(function (res) {
                    expect(mockHomeController.ensureLoggedIn).toHaveBeenCalled();
                    expect(mockThreatModel.models).toHaveBeenCalled();
                })
                .end(finish_test(done));

        });

        it('/threatmodel/org/repo/branch/model/data', function (done) {

            spyOn(mockThreatModel, 'model').and.callThrough();
            spyOn(mockHomeController, 'ensureLoggedIn').and.callThrough();
            require('../../../td/config/routes.config')(app);

            request(app)
                .get('/threatmodel/org/repo/branch/model/data')
                .expect(200)
                .expect(modelBody)
                .expect(function (res) {
                    expect(mockHomeController.ensureLoggedIn).toHaveBeenCalled();
                    expect(mockThreatModel.model).toHaveBeenCalled();
                })
                .end(finish_test(done));

        });

        it('DELETE /threatmodel/org/repo/branch/model', function (done) {

            spyOn(mockThreatModel, 'deleteModel').and.callThrough();
            spyOn(mockHomeController, 'ensureLoggedIn').and.callThrough();
            require('../../../td/config/routes.config')(app);

            request(app)
                .delete('/threatmodel/org/repo/branch/model')
                .expect(200)
                .expect(deleteBody)
                .expect(function (res) {
                    expect(mockCsrfProtectionContainer.mockCsrfProtection).toHaveBeenCalled();
                    expect(mockHomeController.ensureLoggedIn).toHaveBeenCalled();
                    expect(mockThreatModel.deleteModel).toHaveBeenCalled();
                })
                .end(finish_test(done));

        });
        
        it('/threatmodel/org/repo/branch/model/create', function (done) {

            spyOn(mockThreatModel, 'create').and.callThrough();
            spyOn(mockHomeController, 'ensureLoggedIn').and.callThrough();
            require('../../../td/config/routes.config')(app);

            request(app)
                .put('/threatmodel/org/repo/branch/model/create')
                .expect(200)
                .expect(createBody)
                .expect(function (res) {
                    expect(mockCsrfProtectionContainer.mockCsrfProtection).toHaveBeenCalled();
                    expect(mockHomeController.ensureLoggedIn).toHaveBeenCalled();
                    expect(mockThreatModel.create).toHaveBeenCalled();
                })
                .end(finish_test(done));

        });
        
        it('/threatmodel/org/repo/branch/model/update', function (done) {

            spyOn(mockThreatModel, 'update').and.callThrough();
            spyOn(mockHomeController, 'ensureLoggedIn').and.callThrough();
            require('../../../td/config/routes.config')(app);

            request(app)
                .put('/threatmodel/org/repo/branch/model/update')
                .expect(200)
                .expect(updateBody)
                .expect(function (res) {
                    expect(mockCsrfProtectionContainer.mockCsrfProtection).toHaveBeenCalled();
                    expect(mockHomeController.ensureLoggedIn).toHaveBeenCalled();
                    expect(mockThreatModel.update).toHaveBeenCalled();
                })
                .end(finish_test(done));

        });
    })
});
