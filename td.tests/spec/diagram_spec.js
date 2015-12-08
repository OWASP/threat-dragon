'use strict';

describe('diagram controller', function () {
    
    var $scope;
    var $controller;
    var $q;
    var $httpBackend;
    var $location;
    var $timeout;
    var mockDatacontext;
    var mockRouteParams;
    var mockDiagramming;
    var mockThreatEngine;
    var mockDialogs;
    
    var mockNewGraph = 'mock new graph';
    var mockThreatModelIdParam = 0;
    var mockDiagramIdParam = 1;
    
    beforeEach(function () {
        
        mockDatacontext = {};
        mockRouteParams = {};
        mockDiagramming = {};
        mockThreatEngine = {};
        mockDialogs = {};
        
        angular.mock.module('app')
        
        angular.mock.module(function ($provide) {
            $provide.value('datacontext', mockDatacontext);
            $provide.value('$routeParams', mockRouteParams);
            $provide.value('diagramming', mockDiagramming);
            $provide.value('threatengine', mockThreatEngine);
            $provide.value('dialogs', mockDialogs);
        });
        
        angular.mock.inject(function ($rootScope, _$location_, _$controller_, _$q_, _$timeout_, _$httpBackend_) {
            $scope = $rootScope.$new();
            $location = _$location_;
            $controller = _$controller_;
            $q = _$q_;
            $timeout = _$timeout_;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET().respond();
        });
        
        //$routeParams mock
        mockRouteParams.threatModelId = mockThreatModelIdParam;
        mockRouteParams.diagramId = mockDiagramIdParam;

        //diagramming mock  
        mockDiagramming.newGraph = function () { return mockNewGraph };
        spyOn(mockDiagramming, 'newGraph').and.callThrough();
        
        $controller('diagram as vm', { $scope: $scope });
        $scope.$apply();
    });
    
    describe('controller initialisation tests', function () {
                
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

    describe('save tests: ', function () {
        
        beforeEach(function() {
            
            mockDatacontext.saveThreatModelDiagram = function() { return $q.when(true); };
            spyOn(mockDatacontext, 'saveThreatModelDiagram').and.callThrough();
            
        })

        it('should save the threat model', function () {
            
            var threatModelId = 'threat model id';
            var diagramId = 'diagram id';
            var graph = {title: 'test graph', on: function() {}};
            
            $scope.vm.threatModelId = threatModelId;
            $scope.vm.diagramId = diagramId;
            $scope.vm.graph = graph;
            $scope.vm.edit();       
            expect($scope.vm.dirty).toBe(true);
            $scope.vm.save();
            $scope.$apply();
            
            //save
            expect(mockDatacontext.saveThreatModelDiagram).toHaveBeenCalled();
            expect(mockDatacontext.saveThreatModelDiagram.calls.argsFor(0)[0]).toEqual(threatModelId);
            expect(mockDatacontext.saveThreatModelDiagram.calls.argsFor(0)[1]).toEqual(diagramId);
            expect(mockDatacontext.saveThreatModelDiagram.calls.argsFor(0)[2].diagramJson).toEqual(JSON.stringify(graph));           
            expect($scope.vm.dirty).toBe(false);
        })
    })
    
    describe('graph tests: ', function() {
        
        beforeEach(function() {
            
            mockDiagramming.getElements = function() { return [{id: 'eid1'}, {id: 'eid2'}]; };
            spyOn(mockDiagramming, 'getElements').and.callThrough();
            mockDiagramming.getLinks = function() { return [{id: 'lid1'}, {id: 'lid2'}]; };
            spyOn(mockDiagramming, 'getLinks').and.callThrough();
            mockDiagramming.clear = function() { };
            spyOn(mockDiagramming, 'clear');
            mockDiagramming.newProcess = function() { return {id: 'processId'}};
            spyOn(mockDiagramming, 'newProcess').and.callThrough();
            mockDiagramming.newActor = function() { return {id: 'actorId'}};
            spyOn(mockDiagramming, 'newActor').and.callThrough();
            mockDiagramming.newStore = function() { return {id: 'storeId'}};
            spyOn(mockDiagramming, 'newStore').and.callThrough();
            mockDiagramming.newBoundary = function() { return {id: 'boundaryId'}};
            spyOn(mockDiagramming, 'newBoundary').and.callThrough();
            mockDiagramming.newFlow = function() { return {id: 'flowId'}};
            spyOn(mockDiagramming, 'newFlow').and.callThrough();  
            
        });
        
        it('should clear all elements and links', function() {
           
           var graph = {title: 'test graph'};
           $scope.vm.graph = graph;
           $scope.vm.clear();
           
           expect(mockDiagramming.getElements).toHaveBeenCalled();
           expect(mockDiagramming.getLinks).toHaveBeenCalled();
           expect(mockDiagramming.clear).toHaveBeenCalled();
           expect(mockDiagramming.clear.calls.argsFor(0)).toEqual([ graph ]);
            
        });
        
        it('should add a new process', function() {
           
           var graph = {title: 'test graph'};
           $scope.vm.graph = graph;
           $scope.vm.newProcess();
           expect(mockDiagramming.newProcess).toHaveBeenCalled();
           expect(mockDiagramming.newProcess.calls.argsFor(0)).toEqual([graph]);
            
        });
        
        it('should add a new actor', function() {
           
           var graph = {title: 'test graph'};
           $scope.vm.graph = graph;
           $scope.vm.newActor();
           expect(mockDiagramming.newActor).toHaveBeenCalled();
           expect(mockDiagramming.newActor.calls.argsFor(0)).toEqual([graph]);
            
        });
        
        it('should add a new store', function() {
 
           var graph = {title: 'test graph'};
           $scope.vm.graph = graph;       
           $scope.vm.newStore();
           expect(mockDiagramming.newStore).toHaveBeenCalled();
           expect(mockDiagramming.newStore.calls.argsFor(0)).toEqual([graph]);
            
        });
        
        it('should add a new boundary', function() {
            
           var graph = {title: 'test graph'}; 
           $scope.vm.graph = graph;  
           $scope.vm.newBoundary();
           expect(mockDiagramming.newBoundary).toHaveBeenCalled();
           expect(mockDiagramming.newBoundary.calls.argsFor(0)).toEqual([graph]);
            
        });
        
        it('should add a new flow', function() {
            
           var graph = {title: 'test graph'};
           var source = 'source';
           var target = 'target';
           $scope.vm.graph = graph;
           $scope.vm.newFlow(source, target);
           expect(mockDiagramming.newFlow).toHaveBeenCalled();
           expect(mockDiagramming.newFlow.calls.argsFor(0)).toEqual([graph, source, target]);
            
        });
    })
        
    describe('zoom tests', function() {
        
        beforeEach(function() {
            
            mockDiagramming.zoom = function() { };
            spyOn(mockDiagramming, 'zoom');
            
        })
        
        it('should increase the zoom level', function() {
            
            $scope.vm.maxZoom = 5;
            $scope.vm.currentZoomLevel = 1;
            $scope.vm.zoomIn();
            expect(mockDiagramming.zoom).toHaveBeenCalled();
            expect(mockDiagramming.zoom.calls.argsFor(0)[1]).toEqual(2);
            expect($scope.vm.currentZoomLevel).toEqual(2);
            
        });
        
        it('should not increase the zoom level', function() {
 
            $scope.vm.maxZoom = 5;
            $scope.vm.currentZoomLevel = 5;
            $scope.vm.zoomIn();
            expect(mockDiagramming.zoom).not.toHaveBeenCalled();
            expect($scope.vm.currentZoomLevel).toEqual(5);           
               
        });
        
        it('should decrease the zoom level', function() {
            
            $scope.vm.maxZoom = 0;
            $scope.vm.currentZoomLevel = 1;
            $scope.vm.zoomOut();
            expect(mockDiagramming.zoom).toHaveBeenCalled();
            expect(mockDiagramming.zoom.calls.argsFor(0)[1]).toEqual(0);
            expect($scope.vm.currentZoomLevel).toEqual(0);
            
        });
        
        it('should not decrease the zoom level', function() {
 
            $scope.vm.maxZoom = 0;
            $scope.vm.currentZoomLevel = 0;
            $scope.vm.zoomOut();
            expect(mockDiagramming.zoom).not.toHaveBeenCalled();
            expect($scope.vm.currentZoomLevel).toEqual(0);           
               
        }); 
    });
    
    describe('confirmation tests: ', function() {
        
        beforeEach(function() {
            
            //dialogs mock
            mockDialogs.confirm = function() { };
            
            //diagramming mocks
            mockDiagramming.cellCount = function() { };
        });
        
        it('should ask for confirmation and reload', function() {
            
            spyOn(mockDialogs, 'confirm');
            spyOn(mockDiagramming, 'cellCount').and.returnValue(5); 
            spyOn($scope.vm, 'initialise');  
            $scope.vm.dirty= true;
            $scope.vm.reload();
            expect(mockDialogs.confirm).toHaveBeenCalled()
            expect(mockDialogs.confirm.calls.argsFor(0)[0]).toEqual('./app/diagrams/confirmReloadOnDirty.html');
            //argument 1 is onOk
            mockDialogs.confirm.calls.argsFor(0)[1]();
            expect($scope.vm.initialise).toHaveBeenCalled();
            
        });
        
        it('should reload without asking for confirmation (model not dirty)', function() {
            
            spyOn(mockDialogs, 'confirm');            
            spyOn($scope.vm, 'initialise');
            spyOn(mockDiagramming, 'cellCount').and.returnValue(5);  
            $scope.vm.dirty= false;
            $scope.vm.reload();
            expect(mockDialogs.confirm).not.toHaveBeenCalled();
            expect($scope.vm.initialise).toHaveBeenCalled();
            
        });
        
        it('should reload without asking for confirmation (empty graph)', function() {

            spyOn(mockDialogs, 'confirm'); 
            spyOn($scope.vm, 'initialise'); 
            spyOn(mockDiagramming, 'cellCount').and.returnValue(0);  
            $scope.vm.dirty= true;
            $scope.vm.reload();
            expect(mockDialogs.confirm).not.toHaveBeenCalled();
            expect($scope.vm.initialise).toHaveBeenCalled();
            
        });
    });
    
    describe('model initialisaton tests: ', function() {
        
        var newDiagram;
        var threatModelId;
        var diagramId;
        var graph;
        var title;
        var diagramData;
        
        beforeEach(function() {
            
            //datacontext mock
            mockDatacontext.getThreatModelDiagram = function() { return $q.when(true); };            
            
            //diagramming mocks
            mockDiagramming.initialise = function() { };
            spyOn(mockDiagramming, 'initialise');
            mockDiagramming.resize = function() { };
            spyOn(mockDiagramming, 'resize');
            
            newDiagram = {};
            threatModelId = 'threat model id';
            diagramId = 'diagram id';
            graph = new joint.dia.Graph();
            title = 'diagram title';
            diagramData = {title: title};

            $scope.vm.graph = graph;
            $scope.vm.threatModelId = threatModelId;
            $scope.vm.diagramId = diagramId;
            $scope.vm.loaded = false;
            $scope.vm.dirty = true;
         })
    
        it('should initialise a model with Json and size', function() {
        
            var diagramJson = 'diagram JSON';
            var size = 'size';
            diagramData.size = size;
            diagramData.diagramJson = diagramJson;
            
            spyOn(mockDatacontext, 'getThreatModelDiagram').and.returnValue($q.when(diagramData));           
            $scope.vm.initialise(newDiagram);
            $scope.$apply();
            
            expect(mockDatacontext.getThreatModelDiagram).toHaveBeenCalled();
            expect(mockDatacontext.getThreatModelDiagram.calls.argsFor(0)).toEqual([threatModelId, diagramId]);    
            expect(mockDiagramming.initialise).toHaveBeenCalled();
            expect(mockDiagramming.initialise.calls.argsFor(0)).toEqual([graph, diagramJson]);
            expect(mockDiagramming.resize).toHaveBeenCalled();
            expect(mockDiagramming.resize.calls.argsFor(0)).toEqual([newDiagram, size]);
            expect($scope.vm.loaded).toBe(true);
            expect($scope.vm.dirty).toBe(false);
            expect($scope.vm.diagramTitle).toEqual(title);
                 
        })
        
        it('should initialise a model without Json and size', function() {
                   
            spyOn(mockDatacontext, 'getThreatModelDiagram').and.returnValue($q.when(diagramData));           
            $scope.vm.initialise(newDiagram);
            $scope.$apply();
            
            expect(mockDatacontext.getThreatModelDiagram).toHaveBeenCalled();
            expect(mockDatacontext.getThreatModelDiagram.calls.argsFor(0)).toEqual([threatModelId, diagramId]);    
            expect(mockDiagramming.initialise).not.toHaveBeenCalled();
            expect(mockDiagramming.resize).not.toHaveBeenCalled();
            expect($scope.vm.loaded).toBe(true);
            expect($scope.vm.dirty).toBe(false);
            expect($scope.vm.diagramTitle).toEqual(title);
                 
        })
        
        it('should initialise a model and select the specified element', function() {
            
            spyOn(mockDatacontext, 'getThreatModelDiagram').and.returnValue($q.when(diagramData));           
            var elementId = 'elementId';
            mockRouteParams.element = elementId;
            var element = {id: elementId};
            var elementProperties = 'element properties';
            mockDiagramming.getCellById = function() { return element; };
            spyOn(mockDiagramming, 'getCellById').and.callThrough();
            newDiagram.setSelected = function() {};
            spyOn(newDiagram, 'setSelected');
            $scope.vm.viewStencil = true;
            $scope.vm.viewThreats = false;
            mockDatacontext.getElementProperties = function() { return $q.when(elementProperties);};
            spyOn(mockDatacontext, 'getElementProperties').and.callThrough();
            $scope.vm.initialise(newDiagram);
            $timeout.flush();
            $scope.$apply();
            
            expect($scope.vm.selected.element).toEqual(element);
            expect(mockDatacontext.getElementProperties).toHaveBeenCalled();
            expect(mockDatacontext.getElementProperties.calls.argsFor(0)).toEqual([threatModelId, diagramId, elementId]);
            expect($scope.vm.selected.elementProperties).toEqual(elementProperties);
            expect(mockDiagramming.getCellById).toHaveBeenCalled();
            expect(mockDiagramming.getCellById.calls.argsFor(0)).toEqual([graph, elementId]);
            expect(newDiagram.setSelected).toHaveBeenCalled();
            expect(newDiagram.setSelected.calls.argsFor(0)).toEqual([element]);
            expect($scope.vm.viewStencil).toBe(false);
            expect($scope.vm.viewThreats).toBe(true);
             
        })
        
        it('should error and not load a model', function() {
            
            var errorMessage = 'error message';
            spyOn(mockDatacontext, 'getThreatModelDiagram').and.returnValue($q.reject(errorMessage)); 
            $scope.vm.initialise(newDiagram);
            $scope.$apply();           
                      
            expect($scope.vm.loaded).toBe(false);
            
        });
        
        it('should add a change/add event handler to the graph', function() {
            
            spyOn(mockDatacontext, 'getThreatModelDiagram').and.returnValue($q.when(diagramData));           
            $scope.vm.initialise(newDiagram);
            $scope.$apply();
            expect($scope.vm.dirty).toBe(false);
            
            var rect = new joint.shapes.basic.Rect({
                position: { x: 100, y: 100 },
                size: { width: 70, height: 30 },
                attrs: { text: { text: 'my rectangle' } }
            });

            graph.addCell(rect);
            expect($scope.vm.dirty).toBe(true); 
        });
        
        it('should add a remove event handler to the graph', function() {
            
            var rect = new joint.shapes.basic.Rect({
                position: { x: 100, y: 100 },
                size: { width: 70, height: 30 },
                attrs: { text: { text: 'my rectangle' } }
            });

            graph.addCell(rect);
            $scope.vm.selected = rect;
            $location.search('element', rect.cid);
            
            spyOn(mockDatacontext, 'getThreatModelDiagram').and.returnValue($q.when(diagramData));           
            $scope.vm.initialise(newDiagram);
            $scope.$apply();
            expect($scope.vm.dirty).toBe(false);
            
            rect.remove();

            expect($scope.vm.dirty).toBe(true); 
            expect($scope.vm.selected).toEqual({});
            expect($location.search()).toEqual({});
            
        });
    })
    
    describe('deep linking tests: ', function() {
        
       it('should set the location to the selected element', function() {
            
            var element = {id: 'elementId'};
            spyOn($location, 'search').and.callThrough();
            $scope.vm.select(element);
            expect($location.search).toHaveBeenCalled();
            expect($location.search.calls.argsFor(0)).toEqual(['element', element.id]);
            
        })
        
    });
    
    describe('threat generation tests: ', function() {
        
        var element;
        
        beforeEach(function() {
     
            element = {element: 'element', elementProperties: 'properties'};       

        });
        
        it('should generate threats for the specified element', function() {
            
            var threats = ['threat1', 'threat2', 'threat3'];
            var currentThreat = threats[0];
            mockThreatEngine.generateForElement = function() { return $q.when(threats); };
            spyOn(mockThreatEngine, 'generateForElement').and.callThrough();
            mockDialogs.confirm = function() {};
            spyOn(mockDialogs, 'confirm');
            
            $scope.vm.selected = element;
            $scope.vm.generateThreats()
            $scope.$apply();
            
            expect(mockThreatEngine.generateForElement).toHaveBeenCalled();
            expect(mockThreatEngine.generateForElement.calls.argsFor(0)).toEqual([element]);
            expect(mockDialogs.confirm).toHaveBeenCalled();
            expect(mockDialogs.confirm.calls.argsFor(0)[0]).toEqual('./app/diagrams/ThreatEditPane.html');
            //argument 2 contains the supplied threat
            expect(mockDialogs.confirm.calls.argsFor(0)[2]().threat).toEqual(currentThreat);
            expect(threats.length).toEqual(2);
        });
        
        it('should generate no threats', function() {
            
            var threats = [];
            mockThreatEngine.generateForElement = function() { return $q.when(threats); };
            spyOn(mockThreatEngine, 'generateForElement').and.callThrough();
            mockDialogs.confirm = function() {};
            spyOn(mockDialogs, 'confirm');
            
            $scope.vm.selected = element;
            $scope.vm.generateThreats()
            $scope.$apply();
            
            expect(mockDialogs.confirm).not.toHaveBeenCalled();
        });
        
        it('should add a threat to the element', function() {
            
            var threats = ['threat1', 'threat2', 'threat3'];
            var currentThreat = threats[0];
            mockThreatEngine.generateForElement = function() { return $q.when(threats); };
            spyOn(mockThreatEngine, 'generateForElement').and.callThrough();
            mockDialogs.confirm = function() {};
            spyOn(mockDialogs, 'confirm');
            $scope.vm.selected.elementProperties = {threats: []};
            $scope.vm.dirty = false;
            
            $scope.vm.selected.element = element;
            $scope.vm.generateThreats()
            $scope.$apply();
            
            //argument 0 is confirm - OK/Accept
            mockDialogs.confirm.calls.argsFor(0)[1]();
            $timeout.flush();
            
            expect($scope.vm.selected.elementProperties.threats).toEqual([currentThreat]);
            expect(mockDialogs.confirm.calls.count()).toEqual(2);
            expect($scope.vm.dirty).toBe(true);
        });
        
        it('should add threats to the element', function() {
            
            var threats = ['threat1', 'threat2', 'threat3'];
            var currentThreat = threats[0];
            mockThreatEngine.generateForElement = function() { return $q.when(threats); };
            spyOn(mockThreatEngine, 'generateForElement').and.callThrough();
            mockDialogs.confirm = function() {};
            spyOn(mockDialogs, 'confirm');
            $scope.vm.selected.elementProperties = {threats: []};
            $scope.vm.dirty = false;
            
            $scope.vm.selected.element = element;
            $scope.vm.generateThreats()
            $scope.$apply();
            
            //argument 0 is confirm - OK/Accept
            mockDialogs.confirm.calls.argsFor(0)[1](true);
            $timeout.flush();
            threats.unshift(currentThreat);
            expect($scope.vm.selected.elementProperties.threats).toEqual(threats);
            expect(mockDialogs.confirm.calls.count()).toEqual(1);
            expect($scope.vm.dirty).toBe(true);            
            
        });
        
        it('should not add a threat to the element', function() {
            
            var threats = ['threat1', 'threat2', 'threat3'];
            mockThreatEngine.generateForElement = function() { return $q.when(threats); };
            spyOn(mockThreatEngine, 'generateForElement').and.callThrough();
            mockDialogs.confirm = function() {};
            spyOn(mockDialogs, 'confirm');
            $scope.vm.selected.elementProperties = {threats: []};
            $scope.vm.dirty = false;
            
            $scope.vm.selected.element = element;
            $scope.vm.generateThreats()
            $scope.$apply();
            
            //argument 3 is confirm - Cancel/Ignore
            mockDialogs.confirm.calls.argsFor(0)[3]();
            $timeout.flush();
            
            expect($scope.vm.selected.elementProperties.threats).toEqual([]);
            expect(mockDialogs.confirm.calls.count()).toEqual(2);
            expect($scope.vm.dirty).toBe(false);
        });
        
        it('should not add a threat to the element', function() {
            
            var threats = ['threat1', 'threat2', 'threat3'];
            mockThreatEngine.generateForElement = function() { return $q.when(threats); };
            spyOn(mockThreatEngine, 'generateForElement').and.callThrough();
            mockDialogs.confirm = function() {};
            spyOn(mockDialogs, 'confirm');
            $scope.vm.selected.elementProperties = {threats: []};
            $scope.vm.dirty = false;
            
            $scope.vm.selected.element = element;
            $scope.vm.generateThreats()
            $scope.$apply();
            
            //argument 3 is confirm - Cancel/Ignore
            mockDialogs.confirm.calls.argsFor(0)[3](true);
            $timeout.flush();
            
            expect($scope.vm.selected.elementProperties.threats).toEqual([]);
            expect(mockDialogs.confirm.calls.count()).toEqual(1);
            expect($scope.vm.dirty).toBe(false);
        });
    });
});