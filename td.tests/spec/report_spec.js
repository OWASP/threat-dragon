'use strict';

describe('report controller', function () {

    var $scope;
    var $controller;
    var $q;
    var $httpBackend;
    var common;
    var mockLogger;
    var mockDatacontext;
    var mockRouteParams;
    var mockDiagramming;
    var mockWindow;

    beforeEach(function () {

        mockDatacontext = {};
        mockRouteParams = {};
        mockDiagramming = {};
        mockWindow = {};
        mockLogger = {};

        angular.mock.module('app');
        angular.mock.module('common');

        angular.mock.module(function ($provide) {
            $provide.value('datacontext', mockDatacontext);
            $provide.value('$routeParams', mockRouteParams);
            $provide.value('diagramming', mockDiagramming);
            $provide.value('$window', mockWindow);
            $provide.value('logger', mockLogger);
        });

        angular.mock.inject(function ($rootScope, _common_,  _$controller_, _$q_, _$httpBackend_) {
            $scope = $rootScope.$new();
            $controller = _$controller_;
            $q = _$q_;
            common = _common_;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET().respond();
        });

        //datacontext mock
        mockDatacontext.getThreatModelDetail = function () { return $q.when({ detail: { diagrams: [{id: 0}, {id: 1}, {id: 2}]  } }) };
        spyOn(mockDatacontext, 'getThreatModelDetail').and.callThrough();
        mockDatacontext.getThreatModelDiagram = function () { return $q.when({ diagramJson: 'diagram JSON' }) };

        //$routeParams mock
        mockRouteParams.threatModelId = 5;
        
        //logger mock
        mockLogger.logError = function() {};
        mockLogger.getLogFn = function() { return function() {}; };

        //diagramming mock
        mockDiagramming.newGraph = function () { return {} };
        spyOn(mockDiagramming, 'newGraph').and.callThrough();
        mockDiagramming.initialise = function () { };
        spyOn(mockDiagramming, 'initialise').and.callThrough();
        mockDiagramming.scaleContent = function () { };
        spyOn(mockDiagramming, 'scaleContent').and.callThrough();

        $controller('report as vm', { $scope: $scope });
        $scope.$apply();
    });

    describe('initialisation tests', function () {

        it('should be defined', function () {
            expect($scope.vm).toBeDefined();
        });

        it('should have "Report" for its title', function () {
            expect($scope.vm.title).toEqual('Report');
        });

        it('should call getThreatModelDetail on the datacontext', function () {

            expect(mockDatacontext.getThreatModelDetail).toHaveBeenCalled();
            expect(mockDatacontext.getThreatModelDetail.calls.argsFor(0)).toEqual([5]);
            expect($scope.vm.threatModel).toEqual({ detail: { diagrams: [{ id: 0, graph: { diagramId: 0 } }, { id: 1, graph: { diagramId : 1} }, { id: 2, graph: {diagramId : 2} } ] } });
        });

        it('should get a new graph for each diagram', function () {

            expect(mockDiagramming.newGraph.calls.count()).toEqual(3);

        });

    });

    describe('viewmodel tests', function () {

        beforeEach(function() {

            //$window mock
            mockWindow.print = function () { };
            spyOn(mockWindow, 'print').and.callThrough();

        });

        it('should call window.print', function () {

            $scope.vm.print();
            expect(mockWindow.print).toHaveBeenCalled();

        });

    });

    describe('error on load tests: ', function() {
        
        var mockDiagram = { model: { diagramId: 1, attributes: { cells: { models: [{ id: 0 }, { id: 1 }, { id: 2 }] } } } };
        var errorMessage = 'error message';

        beforeEach(function () {
           
            $scope.vm.loaded = true;
            spyOn(mockDatacontext, 'getThreatModelDiagram').and.returnValue($q.reject(errorMessage));
            $scope.vm.threatModel = { summary: { id: 0 } };
            $scope.vm.initialise(mockDiagram);
            $scope.$apply();

        });
        
        it('should not load the model', function() {
            
            expect($scope.vm.loaded).toBe(false);
             
        });

    });

    describe('viewmodel initialise tests: ', function () {

        var mockDiagram = { model: { diagramId: 1, attributes: { cells: { models: [{ id: 0 }, { id: 1 }, { id: 2 }] } } } };

        beforeEach(function () {

            spyOn(mockDatacontext, 'getThreatModelDiagram').and.callThrough();
            $scope.vm.threatModel = { summary: { id: 0 } };
            $scope.vm.initialise(mockDiagram);
            $scope.$apply();

        });

        it('should call getThreatModelDiagram on the datacontext', function () {

            expect(mockDatacontext.getThreatModelDiagram).toHaveBeenCalled();

        });

        it('should initialise the graph', function () {

            expect(mockDiagramming.initialise.calls.argsFor(0)[1]).toEqual('diagram JSON');

        });

        it('should scale the diagram content', function () {

            expect(mockDiagramming.scaleContent).toHaveBeenCalled();

        });

    });

});