'use strict';

describe('datacontextdemo service:', function () {

    var datacontext;
    var $httpBackend;
    var $rootScope;
    var threatModelUri = 'https://raw.githubusercontent.com/mike-goodwin/owasp-threat-dragon-demo/master/ThreatDragonModels/Demo%20Threat%20Model/Demo%20Threat%20Model.json';

    beforeEach(function () {

        angular.mock.module('app');
        angular.mock.inject(function (_$rootScope_, _$httpBackend_, _datacontextdemo_) {
            $rootScope = _$rootScope_;
            $httpBackend = _$httpBackend_;
            datacontext = _datacontextdemo_;
        });

        $rootScope.$apply();
    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should fetch and set the threatmodel', function () {

        var data = 'test model data';
        var modelData = { data: data };
        $httpBackend.expectGET(threatModelUri, { Accept: 'application/json' })
            .respond(200, modelData);
        datacontext.load();
        $httpBackend.flush();
        expect(datacontext.threatModel.data).toEqual(data);
    });

    it('should only fetch the threat model once', function () {

        var modelData = { data: 'model' };
        var threw = false
        $httpBackend.whenGET(threatModelUri, { Accept: 'application/json' })
            .respond(200, modelData);
        datacontext.load();
        $httpBackend.flush();
        datacontext.load();
        try {
            $httpBackend.flush();
        }
        catch (ex) {
            threw = true;
        }
        expect(datacontext.threatModel.data).toEqual('model');
        expect(threw).toBe(true);
    });

    it('should fetch the threat model twice', function () {

        var modelData = { data: 'model' };
        $httpBackend.whenGET(threatModelUri, { Accept: 'application/json' })
            .respond(200, modelData);
        datacontext.load();
        datacontext.load(null, true);
        $httpBackend.flush(2);
        expect(datacontext.threatModel.data).toEqual('model');
    });

    it('should not set the threat model', function () {

        $httpBackend.expectGET(threatModelUri, { Accept: 'application/json' })
            .respond(400, new Error('error'));

        datacontext.load();
        $httpBackend.flush();
        expect(datacontext.threatModel).toBeNull();

    });
});