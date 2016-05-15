'use strict'

require('jasmine');

describe('threat model controller tests', function () {

    var testToken = 'test token';
    var mockery = require('mockery');
    var moduleUnderTest = '../../td/controllers/threatmodelcontroller';
    var mockRepository = {};
    var mockRequest;
    var mockResponse = {};
    var jsonSpy;
    var testOrg = 'org';
    var testRepo = 'repo';
    var testBranch = 'testBranch';
    var testModel = 'testModel';
    var testBody = 'testBody';
    var testPage = 'testPage';

    beforeEach(function () {

        jsonSpy = jasmine.createSpy('jsonSpy');

        mockResponse.send = function () { };
        mockResponse.status = function () {
            return { json: jsonSpy };
        }

        spyOn(mockResponse, 'send');
        spyOn(mockResponse, 'status').and.callThrough();

        mockRequest = {
            user: {
                accessToken: testToken
            },
            params: {
                organisation: testOrg,
                repo: testRepo,
                branch: testBranch,
                model: testModel
            },
            query: {
                page: testPage
            },
            body: testBody
        };

        mockery.enable({ useCleanCache: true });
        mockery.warnOnReplace(false);
        mockery.warnOnUnregistered(false);
        mockery.registerMock('../repositories/threatmodelrepository', mockRepository);
    });

    afterEach(function () {
        mockery.disable();
    });

    afterAll(function () {
        mockery.deregisterAll();
    });

    it('should fetch the repos for the logged in user', function () {

        var repo1 = 'repo1';
        var repo2 = 'repo2';
        var repo3 = 'repo3';
        var testRepo1 = { full_name: repo1 };
        var testRepo2 = { full_name: repo2 };
        var testRepo3 = { full_name: repo3 };
        var testRepos = [testRepo1, testRepo2, testRepo3];
        var link1 = 'url1; rel="link"';
        var link2 = 'url2; rel="link"';
        var testLinkHeader = link1 + ',' + link2;
        var testHeaders = [testLinkHeader];

        mockRepository.repos = function (page, accessToken, cb) {
            cb(null, testRepos, testHeaders);
        }

        spyOn(mockRepository, 'repos').and.callThrough();

        var controller = require(moduleUnderTest);
        controller.repos(mockRequest, mockResponse);
        expect(mockRepository.repos.calls.argsFor(0)[0]).toEqual(testPage);
        expect(mockRepository.repos.calls.argsFor(0)[1]).toEqual(testToken);
        expect(mockResponse.send.calls.argsFor(0)[0].repos).toEqual([repo1, repo2, repo3]);
        expect(mockResponse.send.calls.argsFor(0)[0].pagination).toEqual({ page: testPage, prev: false, next: false });

    });

    it('should error 500 when fetching the repos for the logged in user', function () {

        var error = new Error('repos error');
        var repos = 'repos';

        mockRepository.repos = function (page, accessToken, cb) {
            cb(error, repos);
        }

        var controller = require(moduleUnderTest);
        controller.repos(mockRequest, mockResponse);
        expect(mockResponse.send).not.toHaveBeenCalled();
        expect(mockResponse.status.calls.argsFor(0)).toEqual([500]);
        expect(jsonSpy.calls.argsFor(0)).toEqual([error]);
    });

    it('should return the specified error when fetching the repos for the logged in user', function () {

        var error = new Error('repos error');
        error.statusCode = 400;

        mockRepository.repos = function (page, accessToken, cb) {
            cb(error, null);
        }

        var controller = require(moduleUnderTest);
        controller.repos(mockRequest, mockResponse);
        expect(mockResponse.send).not.toHaveBeenCalled();
        expect(mockResponse.status.calls.argsFor(0)).toEqual([400]);
        expect(jsonSpy.calls.argsFor(0)).toEqual([error]);
    });

    it('should fetch the branches for the specified repo', function () {

        var branch1 = 'branch1';
        var branch2 = 'branch2';
        var branch3 = 'branch3';
        var testBranch1 = { name: branch1 };
        var testBranch2 = { name: branch2 };
        var testBranch3 = { name: branch3 };
        var testBranches = [testBranch1, testBranch2, testBranch3];
        var link1 = 'url1; rel="link"';
        var link2 = 'url2; rel="link"';
        var testLinkHeader = link1 + ',' + link2;
        var testHeaders = [testLinkHeader];

        mockRepository.branches = function (repoInfo, accessToken, cb) {
            cb(null, testBranches, testHeaders);
        }

        spyOn(mockRepository, 'branches').and.callThrough();

        var controller = require(moduleUnderTest);
        controller.branches(mockRequest, mockResponse);
        expect(mockRepository.branches.calls.argsFor(0)[0]).toEqual({ organisation: testOrg, repo: testRepo, page: testPage });
        expect(mockRepository.branches.calls.argsFor(0)[1]).toEqual(testToken);
        expect(mockResponse.send.calls.argsFor(0)[0].branches).toEqual([branch1, branch2, branch3]);
        expect(mockResponse.send.calls.argsFor(0)[0].pagination).toEqual({ page: testPage, next: false, prev: false });

    });

    it('should error 500 when fetching the branches for the specified repo', function () {

        var error = new Error('branches error');

        mockRepository.branches = function (repoInfo, accessToken, cb) {
            cb(error, null);
        }

        spyOn(mockRepository, 'branches').and.callThrough();

        var controller = require(moduleUnderTest);
        controller.branches(mockRequest, mockResponse);
        expect(mockResponse.send).not.toHaveBeenCalled();
        expect(mockResponse.status.calls.argsFor(0)).toEqual([500]);
        expect(jsonSpy.calls.argsFor(0)).toEqual([error]);

    });

    it('should return the specified error when fetching the branches for the specified repo', function () {

        var error = new Error('branches error');
        error.statusCode = 400;

        mockRepository.branches = function (repoInfo, accessToken, cb) {
            cb(error, null);
        }

        spyOn(mockRepository, 'branches').and.callThrough();

        var controller = require(moduleUnderTest);
        controller.branches(mockRequest, mockResponse);
        expect(mockResponse.send).not.toHaveBeenCalled();
        expect(mockResponse.status.calls.argsFor(0)).toEqual([400]);
        expect(jsonSpy.calls.argsFor(0)).toEqual([error]);

    });

    it('should fetch the models for the specified repo and branch', function () {

        var model1 = 'model1';
        var model2 = 'model2';
        var model3 = 'model3';
        var testModel1 = { name: model1 };
        var testModel2 = { name: model2 };
        var testModel3 = { name: model3 };
        var testModels = [testModel1, testModel2, testModel3];

        mockRepository.models = function (branchInfo, accessToken, cb) {
            cb(null, testModels);
        }

        spyOn(mockRepository, 'models').and.callThrough();

        var controller = require(moduleUnderTest);
        controller.models(mockRequest, mockResponse);
        expect(mockRepository.models.calls.argsFor(0)[0]).toEqual({ organisation: testOrg, repo: testRepo, branch: testBranch });
        expect(mockRepository.models.calls.argsFor(0)[1]).toEqual(testToken);
        expect(mockResponse.send.calls.argsFor(0)).toEqual([[model1, model2, model3]]);

    });

    it('should error 500 when fetching the models for the specified repo and branch', function () {

        var error = new Error('models error');

        mockRepository.models = function (branchInfo, accessToken, cb) {
            cb(error, null);
        }

        spyOn(mockRepository, 'models').and.callThrough();

        var controller = require(moduleUnderTest);
        controller.models(mockRequest, mockResponse);
        expect(mockResponse.send).not.toHaveBeenCalled();
        expect(mockResponse.status.calls.argsFor(0)).toEqual([500]);
        expect(jsonSpy.calls.argsFor(0)).toEqual([error]);

    });

    it('should return the specified error when fetching the models for the specified repo and branch', function () {

        var error = new Error('models error');
        error.statusCode = 400;

        mockRepository.models = function (branchInfo, accessToken, cb) {
            cb(error, null);
        }

        spyOn(mockRepository, 'models').and.callThrough();

        var controller = require(moduleUnderTest);
        controller.models(mockRequest, mockResponse);
        expect(mockResponse.send).not.toHaveBeenCalled();
        expect(mockResponse.status.calls.argsFor(0)).toEqual([400]);
        expect(jsonSpy.calls.argsFor(0)).toEqual([error]);

    });

    it('should fetch the specified model', function () {

        var model = 'model';
        var base64Model = (new Buffer(model).toString('base64'));

        mockRepository.model = function (modelInfo, accessToken, cb) {
            cb(null, { content: base64Model });
        }

        spyOn(mockRepository, 'model').and.callThrough();

        var controller = require(moduleUnderTest);
        controller.model(mockRequest, mockResponse);
        expect(mockRepository.model.calls.argsFor(0)[0]).toEqual({ organisation: testOrg, repo: testRepo, branch: testBranch, model: testModel });
        expect(mockRepository.model.calls.argsFor(0)[1]).toEqual(testToken);
        expect(mockResponse.send.calls.argsFor(0)).toEqual([model]);

    });

    it('should error 500 when fetching the specified model', function () {

        var error = new Error('model error');

        mockRepository.model = function (modelInfo, accessToken, cb) {
            cb(error, null);
        }

        spyOn(mockRepository, 'model').and.callThrough();

        var controller = require(moduleUnderTest);
        controller.model(mockRequest, mockResponse);
        expect(mockResponse.send).not.toHaveBeenCalled();
        expect(mockResponse.status.calls.argsFor(0)).toEqual([500]);
        expect(jsonSpy.calls.argsFor(0)).toEqual([error]);

    });

    it('should return the specified error when fetching the specified model', function () {

        var error = new Error('model error');
        error.statusCode = 400;

        mockRepository.model = function (modelInfo, accessToken, cb) {
            cb(error, null);
        }

        spyOn(mockRepository, 'model').and.callThrough();

        var controller = require(moduleUnderTest);
        controller.model(mockRequest, mockResponse);
        expect(mockResponse.send).not.toHaveBeenCalled();
        expect(mockResponse.status.calls.argsFor(0)).toEqual([400]);
        expect(jsonSpy.calls.argsFor(0)).toEqual([error]);

    });

    it('should create the specified model', function () {

        var createResponse = 'create';

        mockRepository.create = function (modelInfo, accessToken, cb) {
            cb(null, createResponse);
        }

        spyOn(mockRepository, 'create').and.callThrough();

        var controller = require(moduleUnderTest);
        controller.create(mockRequest, mockResponse);
        expect(mockRepository.create.calls.argsFor(0)[0]).toEqual({ organisation: testOrg, repo: testRepo, branch: testBranch, model: testModel, body: testBody });
        expect(mockRepository.create.calls.argsFor(0)[1]).toEqual(testToken);
        expect(mockResponse.send.calls.argsFor(0)).toEqual([createResponse]);

    });

    it('should error 500 when creating the specified model', function () {

        var error = new Error('create error');
        var data = 'create';

        mockRepository.create = function (modelInfo, accessToken, cb) {
            cb(error, data);
        }

        spyOn(mockRepository, 'create').and.callThrough();

        var controller = require(moduleUnderTest);
        controller.create(mockRequest, mockResponse);
        expect(mockResponse.send).not.toHaveBeenCalled();
        expect(mockResponse.status.calls.argsFor(0)).toEqual([500]);
        expect(jsonSpy.calls.argsFor(0)).toEqual([error]);

    });

    it('should return the specified error when creating the specified model', function () {

        var error = new Error('create error');
        error.statusCode = 400 ;

        mockRepository.create = function (modelInfo, accessToken, cb) {
            cb(error, null);
        }

        spyOn(mockRepository, 'create').and.callThrough();

        var controller = require(moduleUnderTest);
        controller.create(mockRequest, mockResponse);
        expect(mockResponse.send).not.toHaveBeenCalled();
        expect(mockResponse.status.calls.argsFor(0)).toEqual([400]);
        expect(jsonSpy.calls.argsFor(0)).toEqual([error]);

    });

    it('should update the specified model', function () {

        var updateResponse = 'update';

        mockRepository.update = function (modelInfo, accessToken, cb) {
            cb(null, updateResponse);
        }

        spyOn(mockRepository, 'update').and.callThrough();

        var controller = require(moduleUnderTest);
        controller.update(mockRequest, mockResponse);
        expect(mockRepository.update.calls.argsFor(0)[0]).toEqual({ organisation: testOrg, repo: testRepo, branch: testBranch, model: testModel, body: testBody });
        expect(mockRepository.update.calls.argsFor(0)[1]).toEqual(testToken);
        expect(mockResponse.send.calls.argsFor(0)).toEqual([updateResponse]);

    });

    it('should error 500 when updating the specified model', function () {

        var error = new Error('update error');
        var data = 'update';

        mockRepository.update = function (modelInfo, accessToken, cb) {
            cb(error, data);
        }

        spyOn(mockRepository, 'update').and.callThrough();

        var controller = require(moduleUnderTest);
        controller.update(mockRequest, mockResponse);
        expect(mockResponse.send).not.toHaveBeenCalled();
        expect(mockResponse.status.calls.argsFor(0)).toEqual([500]);
        expect(jsonSpy.calls.argsFor(0)).toEqual([error]);

    });

    it('should return the specified error when updating the specified model', function () {

        var error = new Error('update error');
        error.statusCode = 400;

        mockRepository.update = function (modelInfo, accessToken, cb) {
            cb(error, null);
        }

        spyOn(mockRepository, 'update').and.callThrough();

        var controller = require(moduleUnderTest);
        controller.update(mockRequest, mockResponse);
        expect(mockResponse.send).not.toHaveBeenCalled();
        expect(mockResponse.status.calls.argsFor(0)).toEqual([400]);
        expect(jsonSpy.calls.argsFor(0)).toEqual([error]);

    });

    it('should delete the specified model', function () {

        var deleteResponse = 'delete';

        mockRepository.deleteModel = function (modelInfo, accessToken, cb) {
            cb(null, deleteResponse);
        }

        spyOn(mockRepository, 'deleteModel').and.callThrough();

        var controller = require(moduleUnderTest);
        controller.deleteModel(mockRequest, mockResponse);
        expect(mockRepository.deleteModel.calls.argsFor(0)[0]).toEqual({ organisation: testOrg, repo: testRepo, branch: testBranch, model: testModel });
        expect(mockRepository.deleteModel.calls.argsFor(0)[1]).toEqual(testToken);
        expect(mockResponse.send.calls.argsFor(0)).toEqual([deleteResponse]);

    });

    it('should error 500 when deleting the specified model', function () {

        var error = new Error('delete error');
        var data = 'delete';

        mockRepository.deleteModel = function (modelInfo, accessToken, cb) {
            cb(error, data);
        }

        spyOn(mockRepository, 'deleteModel').and.callThrough();

        var controller = require(moduleUnderTest);
        controller.deleteModel(mockRequest, mockResponse);
        expect(mockResponse.send).not.toHaveBeenCalled();
        expect(mockResponse.status.calls.argsFor(0)).toEqual([500]);
        expect(jsonSpy.calls.argsFor(0)).toEqual([error]);

    });

    it('should return the specified error when deleting the specified model', function () {

        var error = new Error('delete error');
        error.statusCode = 400;

        mockRepository.deleteModel = function (modelInfo, accessToken, cb) {
            cb(error, null);
        }

        spyOn(mockRepository, 'deleteModel').and.callThrough();

        var controller = require(moduleUnderTest);
        controller.deleteModel(mockRequest, mockResponse);
        expect(mockResponse.send).not.toHaveBeenCalled();
        expect(mockResponse.status.calls.argsFor(0)).toEqual([400]);
        expect(jsonSpy.calls.argsFor(0)).toEqual([error]);

    });

    describe('pagination tests', function () {

        var testRepos;
        var testBranches;

        beforeEach(function () {

            var repo1 = 'repo1';
            var repo2 = 'repo2';
            var repo3 = 'repo3';
            var testRepo1 = { full_name: repo1 };
            var testRepo2 = { full_name: repo2 };
            var testRepo3 = { full_name: repo3 };
            testRepos = [testRepo1, testRepo2, testRepo3];

            var branch1 = 'branch1';
            var branch2 = 'branch2';
            var branch3 = 'branch3';
            var testBranch1 = { name: branch1 };
            var testBranch2 = { name: branch2 };
            var testBranch3 = { name: branch3 };
            testBranches = [testBranch1, testBranch2, testBranch3];

        });


        it('should enable next and disable prev', function () {

            var link1 = 'url1; rel="next"';
            var link2 = 'url2; rel="link"';
            var testLinkHeader = link1 + ',' + link2;
            var testHeaders = {
                link: testLinkHeader
            };

            mockRepository.repos = function (page, accessToken, cb) {
                cb(null, testRepos, testHeaders);
            }

            var controller = require(moduleUnderTest);
            controller.repos(mockRequest, mockResponse);
            expect(mockResponse.send.calls.argsFor(0)[0].pagination).toEqual({ page: testPage, prev: false, next: true });

        });

        it('should enable next and enable prev', function () {

            var link1 = 'url1; rel="next"';
            var link2 = 'url2; rel="prev"';
            var testLinkHeader = link1 + ',' + link2;
            var testHeaders = {
                link: testLinkHeader
            };

            mockRepository.repos = function (page, accessToken, cb) {
                cb(null, testRepos, testHeaders);
            }

            var controller = require(moduleUnderTest);
            controller.repos(mockRequest, mockResponse);
            expect(mockResponse.send.calls.argsFor(0)[0].pagination).toEqual({ page: testPage, prev: true, next: true });

        });

        it('should disable next and enable prev', function () {

            var link1 = 'url1; rel="link"';
            var link2 = 'url2; rel="prev"';
            var testLinkHeader = link1 + ',' + link2;
            var testHeaders = {
                link: testLinkHeader
            };

            mockRepository.repos = function (page, accessToken, cb) {
                cb(null, testRepos, testHeaders);
            }

            var controller = require(moduleUnderTest);
            controller.repos(mockRequest, mockResponse);
            expect(mockResponse.send.calls.argsFor(0)[0].pagination).toEqual({ page: testPage, prev: true, next: false });

        });

        it('should disable next and disable prev', function () {

            var link1 = 'url1; rel="link"';
            var link2 = 'url2; rel="link"';
            var testLinkHeader = link1 + ',' + link2;
            var testHeaders = {
                link: testLinkHeader
            };

            mockRepository.repos = function (page, accessToken, cb) {
                cb(null, testRepos, testHeaders);
            }

            var controller = require(moduleUnderTest);
            controller.repos(mockRequest, mockResponse);
            expect(mockResponse.send.calls.argsFor(0)[0].pagination).toEqual({ page: testPage, prev: false, next: false });

        });

        it('should select repos page 1 if not specified', function () {

            var testHeaders = {};

            mockRepository.repos = function (page, accessToken, cb) {
                cb(null, testRepos, testHeaders);
            }

            spyOn(mockRepository, 'repos').and.callThrough();

            var controller = require(moduleUnderTest);
            delete mockRequest.query.page;
            controller.repos(mockRequest, mockResponse);
            expect(mockRepository.repos.calls.argsFor(0)[0]).toEqual(1);
        })

        it('should select branches page 1 if not specified', function () {

            var testHeaders = {};

            mockRepository.branches = function (page, accessToken, cb) {
                cb(null, testBranches, testHeaders);
            }

            spyOn(mockRepository, 'branches').and.callThrough();

            var controller = require(moduleUnderTest);
            delete mockRequest.query.page;
            controller.branches(mockRequest, mockResponse);
            expect(mockRepository.branches.calls.argsFor(0)[0].page).toEqual(1);
        })
    });
});