'use strict';

describe('datacontext service:', function () {

    var datacontext;
    var $q;
    var $httpBackend;
    var $http;
    var $rootScope;
    var organisation;
    var repo;
    var branch;
    var model;
    var location;

    beforeEach(function () {

        organisation = 'testorg';
        repo = 'testrepo';
        branch = 'testbranch';
        model = 'testmodel';
        location = {
            organisation: organisation,
            repo: repo,
            branch: branch,
            model: model
        };

        angular.mock.module('app');
        angular.mock.module('common');

        angular.mock.inject(function (_$rootScope_, _$q_, _$httpBackend_, _$http_, _datacontext_) {
            $q = _$q_;
            $rootScope = _$rootScope_;
            $httpBackend = _$httpBackend_;
            $http = _$http_;
            $httpBackend.expectGET().respond();
            datacontext = _datacontext_;
        });

        $rootScope.$apply();
    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should call the repos API', function () {

        $httpBackend.expectGET('threatmodel/repos', { Accept: 'application/json' }).respond();
        datacontext.repos();
        $httpBackend.flush();

    });

    it('should call the branches API', function () {

        $httpBackend.expectGET('threatmodel/' + organisation + '/' + repo + '/branches', { Accept: 'application/json' }).respond();
        datacontext.branches(organisation, repo);
        $httpBackend.flush();

    });

    it('should call the models API', function () {

        $httpBackend.expectGET('threatmodel/' + organisation + '/' + repo + '/' + branch + '/models', { Accept: 'application/json' }).respond();
        datacontext.models(organisation, repo, branch);
        $httpBackend.flush();

    });

    it('should set the threatmodel and its location on the service', function () {

        var data = 'test model data';
        var modelData = { data: data };
        $httpBackend.expectGET('threatmodel/' + organisation + '/' + repo + '/' + branch + '/' + model + '/data', { Accept: 'application/json' })
            .respond(200, modelData);
        datacontext.load(location);
        $httpBackend.flush();
        expect(datacontext.threatModel.data).toEqual(data);
        expect(datacontext.threatModel.location).toEqual(location);

    });

    it('should only call the API once', function () {

        var modelData1 = { data: 1 };
        var modelData2 = { data: 2 };
        $httpBackend.whenGET('threatmodel/' + organisation + '/' + repo + '/' + branch + '/' + model + '/data', { Accept: 'application/json' })
            .respond(200, modelData1);
        datacontext.load(location);
        $httpBackend.flush();
        $httpBackend.whenGET('threatmodel/' + organisation + '/' + repo + '/' + branch + '/' + model + '/data', { Accept: 'application/json' })
            .respond(200, modelData2);
        datacontext.load(location);
        try {
            $httpBackend.flush();
        }
        catch (ex) {
            //just here to prevent an incorrectly failed test on the 2nd flush
        }
        expect(datacontext.threatModel.data).toEqual(1);
    });

    it('should call the API twice', function () {

        var modelData1 = { data: 1 };
        var modelData2 = { data: 2 };
        $httpBackend.whenGET('threatmodel/' + organisation + '/' + repo + '/' + branch + '/' + model + '/data', { Accept: 'application/json' })
            .respond(200, modelData1);
        datacontext.load(location);
        $httpBackend.flush();
        var newOrg = 'newtestorg';
        location.organisation = newOrg;
        $httpBackend.whenGET('threatmodel/' + newOrg + '/' + repo + '/' + branch + '/' + model + '/data', { Accept: 'application/json' })
            .respond(200, modelData2);
        datacontext.load(location);
        $httpBackend.flush();
        expect(datacontext.threatModel.data).toEqual(2);
    });

    it('should call the API twice even with the same location', function () {

        var modelData1 = { data: 1 };
        var modelData2 = { data: 2 };
        $httpBackend.expectGET('threatmodel/' + organisation + '/' + repo + '/' + branch + '/' + model + '/data', { Accept: 'application/json' })
            .respond(200, modelData1);
        datacontext.load(location);
        $httpBackend.flush();
        $httpBackend.expectGET('threatmodel/' + organisation + '/' + repo + '/' + branch + '/' + model + '/data', { Accept: 'application/json' })
            .respond(200, modelData2);
        datacontext.load(location, true);
        $httpBackend.flush();
    });

    it('should not set the threat model', function () {

        $httpBackend.expectGET('threatmodel/' + organisation + '/' + repo + '/' + branch + '/' + model + '/data', { Accept: 'application/json' })
            .respond(400, new Error('error'));

        datacontext.load(location);
        $httpBackend.flush();
        expect(datacontext.threatModel).toBeNull();

    });

    it('should call the delete model API', function () {

        datacontext.threatModel = { location: location };
        $httpBackend.expectDELETE('threatmodel/' + organisation + '/' + repo + '/' + branch + '/' + model)
            .respond(200);
        datacontext.deleteModel();
        $httpBackend.flush();
        expect(datacontext.threatModel).toBeNull();
    });

    it('should call the create model API', function () {

        var title1 = 'test';
        var title2 = ' title';
        var title = 'test_title';
        var threatModel = { summary: { title: title1 + title2 } };
        var expectedModel = { summary: { title: title1 + title2 } };
        var expectedLocation = location;
        expectedLocation.model = title;
        expectedModel.location = expectedLocation;
        $httpBackend.expectPUT('threatmodel/' + organisation + '/' + repo + '/' + branch + '/' + title + '/create', expectedModel)
            .respond(200);
        datacontext.create(location, threatModel);
        $httpBackend.flush();
        expect(datacontext.threatModel).toEqual(expectedModel);
    });

    it('should call the update model API', function () {

        datacontext.threatModel = { location: location };
        $httpBackend.expectPUT('threatmodel/' + organisation + '/' + repo + '/' + branch + '/' + model + '/update', datacontext.threatModel)
            .respond(200);
        datacontext.update();
        $httpBackend.flush();
    });

    it('should call the update model API with a new diagram', function () {

        var diagrams = [{ id: 0 }, { id: 1 }, { id: 2 }];

        datacontext.threatModel = {
            detail: {
                diagrams: diagrams
            },
            location: location
        };

        var newDiagramData = {
            diagramJson: 'json',
            size: 'size'
        };

        $httpBackend.expectPUT('threatmodel/' + organisation + '/' + repo + '/' + branch + '/' + model + '/update')
            .respond(200);
        datacontext.saveThreatModelDiagram(1, newDiagramData);
        $httpBackend.flush();
        expect(datacontext.threatModel.detail.diagrams[1].diagramJson).toEqual('json');
        expect(datacontext.threatModel.detail.diagrams[1].size).toEqual('size');
    });
});