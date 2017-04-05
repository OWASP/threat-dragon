'use strict';

require('angular-mocks');

describe('threatModel controller', function () {

    var $scope;
    var $controller;
    var $q;
    var $httpBackend;
    var $location;
    var common;
    var mockRouteParams;
    var mockDatacontext;
    var mockDialogs;
    var mockThreatModelLocator;
    var errorLogger;
    var org = 'org';
    var repo = 'repo';
    var branch = 'branch';
    var model = 'model';

    beforeEach(function () {

        mockDialogs = {};
        mockThreatModelLocator = {
            getModelLocation: function () { },
            getModelPath: function () { },
            willMoveModel: function () { }
        };
        mockRouteParams = {
            organisation: org,
            repo: repo,
            branch: branch,
            model: model
        };
        mockDatacontext = {};

        angular.mock.module('owasp-threat-dragon-core')

        angular.mock.module(function ($provide) {
            $provide.value('datacontext', mockDatacontext);
            $provide.value('$routeParams', mockRouteParams);
            $provide.value('dialogs', mockDialogs);
            $provide.value('threatmodellocator', mockThreatModelLocator);
        });

        angular.mock.inject(function ($rootScope, _$location_, _$controller_, _$q_, _$httpBackend_, _common_) {
            $scope = $rootScope.$new();
            $location = _$location_;
            $controller = _$controller_;
            $q = _$q_;
            common = _common_;
            errorLogger = jasmine.createSpy('errorLogger');
            common.logger.getLogFn = function () {
                return errorLogger;
            };

            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET().respond();
        });


    });

    describe('initialisation tests', function () {

        var location = 'mock location';

        beforeEach(function () {

            //datacontext mock
            mockDatacontext.load = function () { return $q.when('mock threat model') };
            spyOn(mockDatacontext, 'load').and.callThrough();
            mockDatacontext.threatModelLocation = mockRouteParams;

            //model locatormock
            location = 'location';
            spyOn(mockThreatModelLocator, 'getModelLocation').and.returnValue(location);
            spyOn(mockThreatModelLocator, 'getModelPath');
            spyOn(mockThreatModelLocator, 'willMoveModel');

            $controller('threatmodel as vm', { $scope: $scope });
            $scope.$apply();

        });

        it('should be defined', function () {
            expect($scope.vm).toBeDefined();
        });

        it('should have "Threat Model Details" for its title', function () {
            expect($scope.vm.title).toEqual('Threat Model Details');
        });

        it('should call load on the datacontext with location', function () {
            expect(mockDatacontext.load.calls.argsFor(0)[0]).toEqual(location);
        });

        it('should call get the model location from the route params', function () {

            expect(mockThreatModelLocator.getModelLocation.calls.argsFor(0)[0]).toEqual(mockRouteParams);

        });

        it('should get the threat model location', function () {
            $scope.vm.threatModelLocation();
            expect(mockThreatModelLocator.getModelLocation.calls.argsFor(1)[0]).toEqual(mockRouteParams);
        });

        it('should get the threat model path', function () {

            var result = $scope.vm.threatModelPath();
            expect(mockThreatModelLocator.getModelPath.calls.argsFor(0)[0]).toEqual(mockRouteParams);
        });

        it('should check if the model will move', function () {
            var changes = {data: 'change'};
            var result = $scope.vm.willMoveThreatModel(changes);
            expect(mockThreatModelLocator.willMoveModel.calls.argsFor(0)).toEqual([mockRouteParams,changes]);
        });

        it('threatmodel should be set to "mock threat model"', function () {

            expect($scope.vm.threatModel).toEqual('mock threat model');

        });

        it('should not reload the threat model', function () {

            $scope.vm.dirty = true;
            $scope.vm.threatModel = 'original threat model';

            //mock dialog - cancel
            mockDialogs.confirm = function (template, onOkPreClose, getParameter, onCancelPreClose) {
                onCancelPreClose();
            }

            $scope.vm.reload();
            $scope.$apply();

            expect($scope.vm.threatModel).toEqual('original threat model');
            expect($scope.vm.dirty).toBe(true);

        });

        it('should show confirm dialog and reload the threat model', function () {

            $scope.vm.dirty = true;
            $scope.vm.threatModel = 'original threat model';

            //mock dialog - ok
            mockDialogs.confirm = function (template, onOkPreClose, getParameter, onCancelPreClose) {
                onOkPreClose();
            }

            $scope.vm.reload();
            $scope.$apply();

            expect($scope.vm.threatModel).toEqual('mock threat model');
            expect($scope.vm.dirty).toBe(false);

        });

        it('should reload the threat model', function () {

            $scope.vm.dirty = false;
            $scope.vm.threatModel = 'original threat model';

            $scope.vm.reload();
            $scope.$apply();

            expect($scope.vm.threatModel).toEqual('mock threat model');
            expect($scope.vm.dirty).toBe(false);

        });

    });

    describe('new model tests', function () {

        var mockPath = 'mock path';

        beforeEach(function () {
            //datacontext mock
            mockDatacontext.load = function () { return $q.when('mock threat model') };
            spyOn(mockDatacontext, 'load').and.callThrough();
            //location and locator mock
            var newLocation = '/new/threatmodel';
            $location.path(newLocation);
            mockThreatModelLocator.newModelLocation = newLocation;
            spyOn(mockThreatModelLocator, 'getModelPath').and.returnValue(mockPath);

            $controller('threatmodel as vm', { $scope: $scope });
            $scope.$apply();
        });

        it('should not call load on the datacontext and threat model should be new', function () {

            expect(mockDatacontext.load.calls.count()).toEqual(0);
            expect($scope.vm.threatModel).toEqual({ summary: {}, detail: { contributors: [], diagrams: [] } });

        });

        it('should save the the threat model at the specified location', function () {

            var org = 'org';
            var repo = 'repo';
            var branch = 'branch';
            var model = 'model';

            mockRouteParams = {
                organisation: org,
                repo: repo,
                branch: branch,
                model: model
            };

            var threatModel = {
                id: 'model id'
            };

            mockDatacontext.create = function (location, model) {
                mockDatacontext.threatModelLocation = location;
                return $q.when({location: location});
            }

            spyOn($location, 'path');
            spyOn(mockDatacontext, 'create').and.callThrough();
            $scope.vm.threatModel = threatModel;
            $scope.vm.create();
            $scope.$apply();
            expect(mockThreatModelLocator.getModelPath.calls.argsFor(0)).toEqual([mockRouteParams]);
            expect(mockDatacontext.create.calls.argsFor(0)).toEqual([mockRouteParams, threatModel]);
            expect($scope.vm.dirty).toBe(false);
            expect($location.path.calls.argsFor(0)).toEqual(['/threatmodel/' + mockPath]);

        });

        it('should error on model creation', function () {

            var testError = new Error('test error');
            var testMessage = 'test message';
            testError.data = { message: testMessage };

            mockDatacontext.create = function () {
                return $q.reject(testError);
            }

            spyOn(mockDatacontext, 'create').and.callThrough();

            $scope.vm.dirty = true;
            $scope.vm.create();
            $scope.$apply();
            expect($scope.vm.dirty).toBe(true);
            expect($scope.vm.errored).toBe(true);
            expect(errorLogger.calls.argsFor(1)).toEqual([testMessage]);

        });
    });

    describe('edit mode tests', function () {

        var mockThreatModel;
        var mockPath;
        var mockModelLocation;

        beforeEach(function () {

            //mock threat model
            mockThreatModel = {
                summary: {
                    id: 0,
                    title: 'model'
                }
            };

            mockModelLocation = {
                organisation: 'org',
                repo: 'repo',
                branch: 'branch',
                model: 'model'
            };

            //datacontext mock
            mockDatacontext.load = function () { return $q.when('mock threat model') };
            spyOn(mockDatacontext, 'load').and.callThrough();
            mockDatacontext.deleteModel = function () { return $q.when(null) };
            spyOn(mockDatacontext, 'deleteModel').and.callThrough();
            mockDatacontext.update = function (location) { return $q.when({location: mockModelLocation}) };
            spyOn(mockDatacontext, 'update').and.callThrough();
            mockDatacontext.create = function () { return $q.when({location: mockModelLocation}) };
            spyOn(mockDatacontext, 'create').and.callThrough();

            //location mock
            mockPath = 'mock path';
            $location.path(mockPath);

            //locator mocks
            spyOn(mockThreatModelLocator, 'getModelPath').and.returnValue(mockPath);

            $controller('threatmodel as vm', { $scope: $scope });
            $scope.$apply();
        });

        it('should check before exiting', function () {

            mockDialogs.structuredExit = function (event) {
                event.preventDefault();
            };

            spyOn(mockDialogs, 'structuredExit').and.callThrough();

            $scope.vm.dirty = true;
            $location.path('/test/');
            $scope.$apply();
            expect(mockDialogs.structuredExit).toHaveBeenCalled();
        });

        it('should call update on the datacontext and navigate to the ThreatModel view', function () {

            $scope.vm.threatModel = mockThreatModel;
            spyOn($location, 'path');
            mockDatacontext.threatModelLocation = mockRouteParams;
            $scope.vm.save();
            $scope.$apply();
            expect(mockThreatModelLocator.getModelPath.calls.argsFor(0)).toEqual([mockModelLocation]);
            expect($location.path).toHaveBeenCalledWith('/threatmodel/' + mockPath);
            expect(mockDatacontext.update).toHaveBeenCalled();

        });

        it('should call delete model on the datacontext and navigate to the welcome view', function () {

            $scope.vm.threatModel = mockThreatModel;
            $scope.vm.threatModel.location = mockModelLocation;
            spyOn($location, 'path');
            $scope.vm.deleteModel();
            $scope.$apply();
            expect(mockDatacontext.deleteModel).toHaveBeenCalled();
            expect($location.path).toHaveBeenCalledWith('/');

        });

        it('should navigate to the specified threat model view', function () {

            $scope.vm.threatModel = mockThreatModel;
            mockDatacontext.threatModelLocation = mockRouteParams;
            spyOn($location, 'path');
            $scope.vm.cancel();
            expect($location.path).toHaveBeenCalledWith('/threatmodel/' + mockPath);
            expect(mockThreatModelLocator.getModelPath.calls.argsFor(0)).toEqual([mockModelLocation]);

        });

        it('should navigate to the welcome view', function () {

            $scope.vm.threatModel = { summary: {} };
            spyOn($location, 'path');
            $scope.vm.cancel();
            expect($location.path).toHaveBeenCalledWith('/');

        });

        it('should add a new contributor', function () {

            $scope.vm.threatModel = { detail: { contributors: [0, 1, 2] } };
            $scope.vm.addingContributor = true;
            $scope.vm.newContributor = 3;
            $scope.vm.dirty = false;
            $scope.vm.addContributor();

            expect($scope.vm.threatModel.detail.contributors).toEqual([0, 1, 2, { name: 3 }]);
            expect($scope.vm.dirty).toBe(true);
            expect($scope.vm.addingContributor).toBe(false);
            expect($scope.vm.newContributor).toEqual('');

        });

        it('should remove the specified contributor and set the dirty flag', function () {

            $scope.vm.threatModel = { detail: { contributors: [0, 1, 2] } };
            $scope.vm.dirty = false;
            $scope.vm.removeContributor(1);

            expect($scope.vm.dirty).toBe(true);
            expect($scope.vm.threatModel.detail.contributors).toEqual([0, 2]);

        });

        it('should set addingContributor', function () {

            $scope.vm.startAddingContributor();
            expect($scope.vm.addingContributor).toBe(true);

        });

        it('should reset newContributor and addingContributor', function () {

            var originalContributor = $scope.vm.newContributor;
            $scope.vm.addingContributor = true;
            $scope.vm.newContributor = "new contributor";
            $scope.vm.cancelAddingContributor();
            expect($scope.vm.addingContributor).toBe(false);
            expect($scope.vm.newContributor).toEqual(originalContributor);

        });

        it('should add a new diagram', function () {

            $scope.vm.threatModel = { detail: { diagrams: [{ id: 0, datat: 0 }, { id: 1, data: 1 }, { id: 2, data: 2 }] } };
            $scope.vm.addingDiagram = true;
            $scope.vm.newDiagram = { data: 3 };
            $scope.vm.dirty = false;
            $scope.vm.addDiagram();

            expect($scope.vm.threatModel.detail.diagrams).toEqual([{ id: 0, datat: 0 }, { id: 1, data: 1 }, { id: 2, data: 2 }, { id: 3, data: 3 }]);
            expect($scope.vm.dirty).toBe(true);
            expect($scope.vm.addingDiagram).toBe(false);
            expect($scope.vm.newDiagram).toEqual($scope.vm.newDiagram);

        });

        it('should remove the specified diagram and set the dirty flag', function () {

            $scope.vm.threatModel = { detail: { diagrams: [0, 1, 2] } };
            $scope.vm.dirty = false;
            $scope.vm.removeDiagram(1);

            expect($scope.vm.dirty).toBe(true);
            expect($scope.vm.threatModel.detail.diagrams).toEqual([0, 2]);

        });

        it('should set addingDiagram', function () {

            $scope.vm.startAddingDiagram();
            expect($scope.vm.addingDiagram).toBe(true);

        });

        it('should reset newDiagram and addingDiagram', function () {

            var originalDiagram = $scope.vm.newDiagram;
            $scope.vm.addingDiagram = true;
            $scope.vm.cancelAddingDiagram();
            expect($scope.vm.addingDiagram).toBe(false);
            expect($scope.vm.newDiagram).toEqual(originalDiagram);

        });
    });
});