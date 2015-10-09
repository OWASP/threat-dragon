'use strict';

describe('report controller', function () {
    
    var $scope;
    var $controller;
    var $q;
    var $httpBackend;
    var mockDatacontext;
    var mockRouteParams;
    var mockDiagramming;
    var mockWindow;
    
    beforeEach(function () {
        
        mockDatacontext = {};
        mockRouteParams = {};
        mockDiagramming = {};
        mockWindow = {};
        
        angular.mock.module('app')
        
        angular.mock.module(function ($provide) {
            $provide.value('datacontext', mockDatacontext);
            $provide.value('$routeParams', mockRouteParams);
            $provide.value('diagramming', mockDiagramming);
            $provide.value('$window', mockWindow);
        });
        
        angular.mock.inject(function ($rootScope, _$controller_, _$q_, _$httpBackend_) {
            $scope = $rootScope.$new();
            $controller = _$controller_;
            $q = _$q_;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET().respond();
        });
        
        //datacontext mock
        mockDatacontext.getThreatModelDetail = function () { return $q.when({ detail: { diagrams: [{id: 0}, {id: 1}, {id: 2}]  } }) };
        spyOn(mockDatacontext, 'getThreatModelDetail').and.callThrough();
        mockDatacontext.getThreatModelDiagram = function () { return $q.when({ diagramJson: 'diagram JSON' }) };
        spyOn(mockDatacontext, 'getThreatModelDiagram').and.callThrough();
        mockDatacontext.getElementProperties = function () { return $q.when('mock element properties')};
        spyOn(mockDatacontext, 'getElementProperties').and.callThrough();
        
        //$routeParams mock
        mockRouteParams.threatModelId = 5;
        
        //diagramming mock
        mockDiagramming.newGraph = function () { return {} };
        spyOn(mockDiagramming, 'newGraph').and.callThrough();
        mockDiagramming.initialise = function () { };
        spyOn(mockDiagramming, 'initialise').and.callThrough();
        mockDiagramming.scaleContent = function () { };
        spyOn(mockDiagramming, 'scaleContent').and.callThrough();
        
        
        //$window mock
        mockWindow.print = function () { };
        spyOn(mockWindow, 'print').and.callThrough();

        
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

        it('should call window.print', function () {

            $scope.vm.print();
            expect(mockWindow.print).toHaveBeenCalled();

        });

    });

    describe('viewmodel initialise tests', function () {
        
        var mockDiagram = { model: { diagramId: 1, attributes: { cells: { models: [{ id: 0 }, { id: 1 }, { id: 2 }] } } } };

        beforeEach(function () {
            
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

        it('should call getElementProperties on the datacontext for each diagram element', function () {

            expect(mockDatacontext.getElementProperties.calls.argsFor(0)).toEqual([1, 0]);
            expect(mockDatacontext.getElementProperties.calls.argsFor(1)).toEqual([1, 1]);
            expect(mockDatacontext.getElementProperties.calls.argsFor(2)).toEqual([1, 2]);

        });

        it('should set the element properties for each diagram element', function () {

            expect(mockDiagram.model.attributes.cells.models[0].properties).toEqual('mock element properties');
            expect(mockDiagram.model.attributes.cells.models[1].properties).toEqual('mock element properties');
            expect(mockDiagram.model.attributes.cells.models[2].properties).toEqual('mock element properties');

        });

    });

});