'use strict';

describe('diagram controller', function () {
    
    var $scope;
    var $controller;
    var $q;
    var $httpBackend;
    var mockDatacontext;
    var mockRouteParams;
    var mockDiagramming;
    
    var mockNewGraph = 'mock new graph';
    var mockThreatModelIdParam = 0;
    var mockDiagramIdParam = 1;
    
    beforeEach(function () {
        
        mockDatacontext = {};
        mockRouteParams = {};
        mockDiagramming = {};
        
        angular.mock.module('app')
        
        angular.mock.module(function ($provide) {
            $provide.value('datacontext', mockDatacontext);
            $provide.value('$routeParams', mockRouteParams);
            $provide.value('diagramming', mockDiagramming);
        });
        
        angular.mock.inject(function ($rootScope, _$controller_, _$q_, _$httpBackend_) {
            $scope = $rootScope.$new();
            $controller = _$controller_;
            $q = _$q_;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET().respond();
        });
        
        //datacontext mock

        
        //$routeParams mock
        mockRouteParams.threatModelId = mockThreatModelIdParam;
        mockRouteParams.diagramId = mockDiagramIdParam;

        
        //diagramming mock  
        mockDiagramming.newGraph = function () { return mockNewGraph };
        spyOn(mockDiagramming, 'newGraph').and.callThrough();
        
        $controller('diagram as vm', { $scope: $scope });
        $scope.$apply();
    });
    
    describe('initialisation tests', function () {
        
        it('should be defined', function () {
            expect($scope.vm).toBeDefined();
        });
        
        it('should have "ThreatModelDiagram" for its title', function () {
            expect($scope.vm.title).toEqual('ThreatModelDiagram');
        });
        
        it('should start as not dirty', function () {

            expect($scope.vm.dirty).toBe(false);
            
        });

        it('should start with an empty graph', function () {

            expect(mockDiagramming.newGraph).toHaveBeenCalled();
            expect($scope.vm.graph).toEqual(mockNewGraph);
                
        });

        it('should be dispalying the stencil', function () {

            expect($scope.vm.viewStencil).toBe(true);
            expect($scope.vm.viewThreats).toBe(false);

        });

        it('should start unzoomed and with a max zoom defined', function () {

            expect($scope.vm.currentZoomLevel).toEqual(0);
            expect($scope.vm.maxZoom).toBeDefined();

        });

        it('should set the threat model ID from the route params', function () {

            expect($scope.vm.threatModelId).toEqual(mockThreatModelIdParam);

        });

        it('should set the diagram ID from the route params', function () {
            
            expect($scope.vm.diagramId).toEqual(mockDiagramIdParam);

        });

        it('should start with nothing selected', function () {
            
            expect($scope.vm.selected).toEqual({ element: null, elementProperties: null });

        });

    });

    describe('viewmodel tests', function () {

        describe('save', function () {


        })


    });

});