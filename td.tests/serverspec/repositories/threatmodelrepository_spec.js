'use strict';

require('jasmine');
var mockery = require('mockery');
var moduleUnderTest = '../../../td/repositories/threatmodelrepository';
mockery.registerAllowable(moduleUnderTest);

describe('threatmodel repository tests', function () {

    var accessToken = 'access token';
    var mocktonode;
    var mockClient;
    var testPage = 'testPage'
    var repos = 'repos';
    var branches = 'branches';
    var models = 'models';
    var createResponse = 'create';
    var updateResponse = 'update';
    var deleteResponse = 'delete';
    var mockMe;
    var mockRepo;
    var cb;

    beforeEach(function () {

        mockery.enable({ useCleanCache: true });
        mockery.warnOnUnregistered(false);
        mockery.warnOnReplace(false);
        mockClient = {};

        cb = jasmine.createSpy('cb');

        mocktonode = {
            client: function () {
                return mockClient;
            }
        };

        spyOn(mocktonode, 'client').and.callThrough();

        mockMe = {
            repos: function (page, cb) {
                cb(repos);
            }
        };

        mockClient.me = function () {
            return mockMe
        }

        mockRepo = {
            branches: function (page, cb) {
                cb(branches);
            },
            contents: function (message, branch, cb) {
                cb(models);
            },
            createContents: function (path, message, content, branch, cb) {
                cb(createResponse);
            },
            updateContents: function (path, message, content, sha, branch, cb) {
                cb(updateResponse);
            },
            deleteContents: function (path, message, sha, branch, cb) {
                cb(deleteResponse);
            }

        };

        mockClient.repo = function () {
            return mockRepo
        }

        mockery.registerMock('octonode', mocktonode);


    });

    afterEach(function () {

        mockery.disable();

    });

    afterAll(function () {
        mockery.deregisterAll();
    });

    it('should fetch the logged in users repos', function () {

        spyOn(mockMe, 'repos').and.callThrough();
        spyOn(mockClient, 'me').and.callThrough();
        var threatModelRepository = require(moduleUnderTest);
        threatModelRepository.repos(testPage, accessToken, cb);
        expect(mocktonode.client.calls.argsFor(0)).toEqual([accessToken]);
        expect(mockMe.repos.calls.argsFor(0)).toEqual([testPage, cb]);
        expect(mockClient.me).toHaveBeenCalled();
        expect(cb.calls.argsFor(0)).toEqual([repos]);

    });

    it('should fetch the branches for the specified repo', function () {

        var testOrg = 'test org';
        var testRepo = 'test repo';

        var repoInfo = {
            organisation: testOrg,
            repo: testRepo,
            page: testPage
        };

        spyOn(mockRepo, 'branches').and.callThrough();
        spyOn(mockClient, 'repo').and.callThrough();
        var threatModelRepository = require(moduleUnderTest);
        threatModelRepository.branches(repoInfo, accessToken, cb);
        expect(mocktonode.client.calls.argsFor(0)).toEqual([accessToken]);
        expect(mockRepo.branches.calls.argsFor(0)).toEqual([testPage, cb]);
        expect(mockClient.repo.calls.argsFor(0)).toEqual([testOrg + '/' + testRepo]);
        expect(cb.calls.argsFor(0)).toEqual([branches]);

    });

    it('should fetch the models for the specified repo and branch', function () {

        var testOrg = 'test org';
        var testRepo = 'test repo';
        var testBranch = 'test branch';

        var branchInfo = {
            organisation: testOrg,
            repo: testRepo,
            branch: testBranch
        };

        spyOn(mockRepo, 'contents').and.callThrough();
        spyOn(mockClient, 'repo').and.callThrough();
        var threatModelRepository = require(moduleUnderTest);
        threatModelRepository.models(branchInfo, accessToken, cb);
        expect(mocktonode.client.calls.argsFor(0)).toEqual([accessToken]);
        expect(mockRepo.contents.calls.argsFor(0)).toEqual(['ThreatDragonModels', testBranch, cb]);
        expect(mockClient.repo.calls.argsFor(0)).toEqual([testOrg + '/' + testRepo]);
        expect(cb.calls.argsFor(0)).toEqual([models]);

    });

    it('should fetch the specified model', function () {

        var testOrg = 'test org';
        var testRepo = 'test repo';
        var testBranch = 'test branch';
        var testModel = 'test model';

        var modelInfo = {
            organisation: testOrg,
            repo: testRepo,
            branch: testBranch,
            model: testModel
        };

        spyOn(mockRepo, 'contents').and.callThrough();
        spyOn(mockClient, 'repo').and.callThrough();
        var threatModelRepository = require(moduleUnderTest);
        threatModelRepository.model(modelInfo, accessToken, cb);
        expect(mocktonode.client.calls.argsFor(0)).toEqual([accessToken]);
        expect(mockRepo.contents.calls.argsFor(0)).toEqual(['ThreatDragonModels/' + testModel + '/' + testModel + '.json', testBranch, cb]);
        expect(mockClient.repo.calls.argsFor(0)).toEqual([testOrg + '/' + testRepo]);
        expect(cb.calls.argsFor(0)).toEqual([models]);

    });

    it('should create the specified model', function () {

        var testOrg = 'test org';
        var testRepo = 'test repo';
        var testBranch = 'test branch';
        var testModel = 'test model';
        var testContent = {
            content: 'test content',
            id: 1
        };

        var modelInfo = {
            organisation: testOrg,
            repo: testRepo,
            branch: testBranch,
            model: testModel,
            body: testContent
        };

        spyOn(mockRepo, 'createContents').and.callThrough();
        spyOn(mockClient, 'repo').and.callThrough();
        var threatModelRepository = require(moduleUnderTest);
        threatModelRepository.create(modelInfo, accessToken, cb);
        expect(mocktonode.client.calls.argsFor(0)).toEqual([accessToken]);
        expect(mockRepo.createContents.calls.argsFor(0)[0]).toEqual('ThreatDragonModels/' + testModel + '/' + testModel + '.json');
        expect(mockRepo.createContents.calls.argsFor(0)[1]).toEqual('Created by OWASP Threat Dragon');
        expect(mockRepo.createContents.calls.argsFor(0)[2]).toEqual(JSON.stringify(testContent, null, '  '));
        expect(mockRepo.createContents.calls.argsFor(0)[3]).toEqual(testBranch);
        expect(mockRepo.createContents.calls.argsFor(0)[4]).toEqual(cb);
        expect(mockClient.repo.calls.argsFor(0)).toEqual([testOrg + '/' + testRepo]);
        expect(cb.calls.argsFor(0)).toEqual([createResponse]);

    });

    it('should update the specified model', function () {

        var testOrg = 'test org';
        var testRepo = 'test repo';
        var testBranch = 'test branch';
        var testModel = 'test model';
        var testContent = {
            content: 'test content',
            id: 1
        };

        var modelInfo = {
            organisation: testOrg,
            repo: testRepo,
            branch: testBranch,
            model: testModel,
            body: testContent
        };

        spyOn(mockRepo, 'updateContents').and.callThrough();

        var originalModelContent = 'original content';
        var originalModelSha = 'sha';
        var originalModel = {
            content: originalModelContent,
            sha: originalModelSha
        };

        spyOn(mockRepo, 'contents').and.callFake(function (message, branch, cb) {
            cb(null, originalModel);
        });
        spyOn(mockClient, 'repo').and.callThrough();
        var threatModelRepository = require(moduleUnderTest);
        threatModelRepository.update(modelInfo, accessToken, cb);
        expect(mocktonode.client.calls.argsFor(0)).toEqual([accessToken]);
        expect(mockRepo.updateContents.calls.argsFor(0)[0]).toEqual('ThreatDragonModels/' + testModel + '/' + testModel + '.json');
        expect(mockRepo.updateContents.calls.argsFor(0)[1]).toEqual('Updated by OWASP Threat Dragon');
        expect(mockRepo.updateContents.calls.argsFor(0)[2]).toEqual(JSON.stringify(testContent, null, '  '));
        expect(mockRepo.updateContents.calls.argsFor(0)[3]).toEqual(originalModelSha);
        expect(mockRepo.updateContents.calls.argsFor(0)[4]).toEqual(testBranch);
        expect(mockRepo.updateContents.calls.argsFor(0)[5]).toEqual(cb);
        expect(mockClient.repo.calls.argsFor(0)).toEqual([testOrg + '/' + testRepo]);
        expect(cb.calls.argsFor(0)).toEqual([updateResponse]);

    });

    it('should error when updating the specified model', function () {

        var testOrg = 'test org';
        var testRepo = 'test repo';
        var testBranch = 'test branch';
        var testModel = 'test model';
        var testContent = {
            content: 'test content',
            id: 1
        };

        var modelInfo = {
            organisation: testOrg,
            repo: testRepo,
            branch: testBranch,
            model: testModel,
            body: testContent
        };

        spyOn(mockRepo, 'updateContents').and.callThrough();

        var error = new Error('update error');

        spyOn(mockRepo, 'contents').and.callFake(function (message, branch, cb) {
            cb(error);
        });
        spyOn(mockClient, 'repo').and.callThrough();
        var threatModelRepository = require(moduleUnderTest);
        threatModelRepository.update(modelInfo, accessToken, cb);
        expect(mocktonode.client.calls.argsFor(0)).toEqual([accessToken]);
        expect(mockClient.repo.calls.argsFor(0)).toEqual([testOrg + '/' + testRepo]);
        expect(cb.calls.argsFor(0)).toEqual([error, null]);

    });

    it('should delete the specified model', function () {

        var testOrg = 'test org';
        var testRepo = 'test repo';
        var testBranch = 'test branch';
        var testModel = 'test model';
        var testContent = {
            content: 'test content',
            id: 1
        };

        var modelInfo = {
            organisation: testOrg,
            repo: testRepo,
            branch: testBranch,
            model: testModel,
            body: testContent
        };

        spyOn(mockRepo, 'deleteContents').and.callThrough();

        var originalModelContent = 'original content';
        var originalModelSha = 'sha';
        var originalModel = {
            content: originalModelContent,
            sha: originalModelSha
        };

        spyOn(mockRepo, 'contents').and.callFake(function (message, branch, cb) {
            cb(null, originalModel);
        });
        spyOn(mockClient, 'repo').and.callThrough();
        var threatModelRepository = require(moduleUnderTest);
        threatModelRepository.deleteModel(modelInfo, accessToken, cb);
        expect(mocktonode.client.calls.argsFor(0)).toEqual([accessToken]);
        expect(mockRepo.deleteContents.calls.argsFor(0)[0]).toEqual('ThreatDragonModels/' + testModel + '/' + testModel + '.json');
        expect(mockRepo.deleteContents.calls.argsFor(0)[1]).toEqual('Deleted by OWASP Threat Dragon');
        expect(mockRepo.deleteContents.calls.argsFor(0)[2]).toEqual(originalModelSha);
        expect(mockRepo.deleteContents.calls.argsFor(0)[3]).toEqual(testBranch);
        expect(mockRepo.deleteContents.calls.argsFor(0)[4]).toEqual(cb);
        expect(mockClient.repo.calls.argsFor(0)).toEqual([testOrg + '/' + testRepo]);
        expect(cb.calls.argsFor(0)).toEqual([deleteResponse]);

    });

    it('should error when deleting the specified model', function () {

        var testOrg = 'test org';
        var testRepo = 'test repo';
        var testBranch = 'test branch';
        var testModel = 'test model';
        var testContent = {
            content: 'test content',
            id: 1
        };

        var modelInfo = {
            organisation: testOrg,
            repo: testRepo,
            branch: testBranch,
            model: testModel,
            body: testContent
        };

        spyOn(mockRepo, 'deleteContents').and.callThrough();

        var error = new Error('delete error');

        spyOn(mockRepo, 'contents').and.callFake(function (message, branch, cb) {
            cb(error);
        });
        spyOn(mockClient, 'repo').and.callThrough();
        var threatModelRepository = require(moduleUnderTest);
        threatModelRepository.deleteModel(modelInfo, accessToken, cb);
        expect(mocktonode.client.calls.argsFor(0)).toEqual([accessToken]);
        expect(mockClient.repo.calls.argsFor(0)).toEqual([testOrg + '/' + testRepo]);
        expect(cb.calls.argsFor(0)).toEqual([error, null]);

    });
});