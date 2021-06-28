'use strict';

var joint = require('jointjs');

describe('core diagram controller', function () {
    
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
    var mockThreatModelLocator;
    
    var mockNewGraph = 'mock new graph';
    var mockOrg = 'org';
    var mockRepo = 'repo';
    var mockBranch = 'branch';
    var mockModelName = 'model name';
    var mockDiagramId = 'diagram';
    
    beforeEach(function () {
        
        mockDatacontext = {};
        mockRouteParams = {};
        mockDiagramming = {};
        mockThreatEngine = {};
        mockDialogs = {};
        mockThreatModelLocator = {};
        
        angular.mock.module('tdCore')
        
        angular.mock.module(function ($provide) {
            $provide.value('datacontext', mockDatacontext);
            $provide.value('$routeParams', mockRouteParams);
            $provide.value('diagramming', mockDiagramming);
            $provide.value('threatengine', mockThreatEngine);
            $provide.value('dialogs', mockDialogs);
            $provide.value('threatmodellocator', mockThreatModelLocator);
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
        mockRouteParams.diagramId = mockDiagramId;

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

        it('should be displaying the stencil', function () {

            expect($scope.vm.viewStencil).toBe(true);
            expect($scope.vm.viewThreats).toBe(false);

        });

        it('should start unzoomed and with a max zoom defined', function () {

            expect($scope.vm.currentZoomLevel).toEqual(0);
            expect($scope.vm.maxZoom).toBeDefined();

        });

        it('should set the diagram ID from the route params', function () {
            
            expect($scope.vm.diagramId).toEqual(mockDiagramId);

        });

        it('should start with nothing selected', function () {
            
            expect($scope.vm.selected).toBeNull();

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
            var cellsArray = ['c1', 'c2', 'c3'];
            var graph = {
                title: 'test graph', 
                on: function() {},
                getCells: function() { return cellsArray;}
            };
            
            $scope.vm.threatModelId = threatModelId;
            $scope.vm.diagramId = diagramId;
            $scope.vm.graph = graph;
            $scope.vm.edit();       
            expect($scope.vm.dirty).toBe(true);
            $scope.vm.save();
            $scope.$apply();
            
            //save
            expect(mockDatacontext.saveThreatModelDiagram).toHaveBeenCalled();
            expect(mockDatacontext.saveThreatModelDiagram.calls.argsFor(0)[0]).toEqual(diagramId);
            expect(mockDatacontext.saveThreatModelDiagram.calls.argsFor(0)[1].diagramJson.cells).toEqual(cellsArray);           
            expect($scope.vm.dirty).toBe(false);
        })
    })
    
    describe('graph tests: ', function() {
        
        var graph;

        beforeEach(function() {

           graph = {title: 'test graph'};

        })

        it('should clear all elements and links', function() {
           
           graph.clearAll = function() { };
           spyOn(graph, 'clearAll');
           $scope.vm.graph = graph;
           var currentDiagram = {};
           currentDiagram.resize = function() { };
           spyOn(currentDiagram, 'resize');
           $scope.vm.currentDiagram = currentDiagram;

           $scope.vm.clear();
           expect(graph.clearAll).toHaveBeenCalled();
           expect(currentDiagram.resize).toHaveBeenCalled();
            
        });
        
        it('should add a new process', function() {
           
           graph.addProcess = function() { return {id: 'processId'}};
           spyOn(graph, 'addProcess').and.callThrough();
           $scope.vm.graph = graph;
           $scope.vm.newProcess();
           expect(graph.addProcess).toHaveBeenCalled();
            
        });
        
        it('should add a new actor', function() {
           
           graph.addActor = function() { return {id: 'actorId'}};
           spyOn(graph, 'addActor').and.callThrough();
           $scope.vm.graph = graph;
           $scope.vm.newActor();
           expect(graph.addActor).toHaveBeenCalled();
            
        });
        
        it('should add a new store', function() {
 
           graph.addStore = function() { return {id: 'storeId'}};
           spyOn(graph, 'addStore').and.callThrough();
           $scope.vm.graph = graph;       
           $scope.vm.newStore();
           expect(graph.addStore).toHaveBeenCalled();
            
        });
        
        it('should add a new boundary', function() {
            
           graph.addBoundary = function() { return {id: 'boundaryId'}};
           spyOn(graph, 'addBoundary').and.callThrough();
           $scope.vm.graph = graph;  
           $scope.vm.newBoundary();
           expect(graph.addBoundary).toHaveBeenCalled();
            
        });
        
        it('should add a new flow', function() {
            
           var source = 'source';
           var target = 'target';
           graph.addFlow = function() { return {id: 'flowId'}};
           spyOn(graph, 'addFlow').and.callThrough();  
           $scope.vm.graph = graph;
           $scope.vm.newFlow(source, target);
           expect(graph.addFlow).toHaveBeenCalled();
           expect(graph.addFlow.calls.argsFor(0)).toEqual([source, target]);
            
        });

        it('should duplicate a flow element', function() {

            var label = [{ attrs : { text : { text : "flowName"} } } ];
            var element = {id: 'elementId', attributes: {type : "tm.Flow", labels : label}};
            graph.duplicateElement = function() { return {id: 'newElementId', attributes: {type : "tm.Flow", labels : label}}};
            graph.getCells = function() {};
            graph.initialise = function() {};
            spyOn($scope.vm, 'cloneElement').and.callThrough();
            $scope.vm.graph = graph;
            $scope.vm.selected = element;
            $scope.vm.duplicateElement();
            expect($scope.vm.cloneElement).toHaveBeenCalled();
        });

        it('should duplicate an actor element', function() {

            var label = { text : { text : "actorName"} };
            var element = {id: 'elementId', attributes: {type : "tm.Actor", position : { y : 10}, attrs : label}};
            graph.duplicateElement = function() { return {id: 'newElementId', 
                                    attributes: {type : "tm.Actor", size : {height : 30}, position : { y : 10}, attrs : label}}};
            graph.getCells = function() {};
            graph.initialise = function() {};
            spyOn($scope.vm, 'cloneElement').and.callThrough();
            $scope.vm.graph = graph;
            $scope.vm.selected = element;
            $scope.vm.duplicateElement();
            expect($scope.vm.cloneElement).toHaveBeenCalled();
        });

        it('should duplicate a boundary element', function() {

            var label = { text : { text : "boundaryName"} };
            var element = {id: 'elementId', attributes: {type : "tm.Boundary", position : { y : 10}, attrs : label}};
            graph.duplicateElement = function() { return {id: 'newElementId', 
                                    attributes: {type : "tm.Boundary", size : {height : 30}, position : { y : 10}, attrs : label}}};
            graph.getCells = function() {};
            graph.initialise = function() {};
            spyOn($scope.vm, 'cloneElement').and.callThrough();
            $scope.vm.graph = graph;
            $scope.vm.selected = element;
            $scope.vm.duplicateElement();
            expect($scope.vm.cloneElement).toHaveBeenCalled();
        });

        it('should not duplicate an element - no element selected', function() {

            graph.cloneElement = function() { return {"type": "tm.Flow", id: 'elementId'}};
            spyOn(graph, 'cloneElement').and.callThrough();
            $scope.vm.selected = null;
            $scope.vm.duplicateElement();
            expect(graph.cloneElement).not.toHaveBeenCalled();

        });

        it('should clone an element', function() {

            var element = {id: 'elementId'};
            graph.duplicateElement = function() { return {id: 'elementId'}};
            spyOn(graph, 'duplicateElement').and.callThrough();
            $scope.vm.graph = graph;
            $scope.vm.selected = element;
            $scope.vm.cloneElement(element);
            expect(graph.duplicateElement).toHaveBeenCalled();

        });
        
        //helper for threat watcher unit tests
        function setOpenThreats(cell) {
        
            var threat = {threatId: '1', status: 'Mitigated'};
            cell.threats = [threat];
            $scope.vm.graph.getCell = function() { return cell; }
            cell.hasOpenThreats = false;
            cell.threats[0].status = 'Open';
            $scope.$apply();
            expect(cell.hasOpenThreats).toBe(true);   
            
        }
        
        //helper for threat watcher unit tests
        function setMitigatedThreats(cell) {
        
            var threat = {threatId: '1', status: 'Open'};
            cell.threats = [threat];
            $scope.vm.graph.getCell = function() { return cell; }
            cell.hasOpenThreats = true;
            cell.threats[0].status = 'Mitigated';
            $scope.$apply();
            expect(cell.hasOpenThreats).toBe(false);   
            
        }

        //helper for threat watcher unit tests
        function setNoThreats(cell) {
        
            var threat = {threatId: '1', status: 'Open'};
            cell.threats = [threat];
            $scope.vm.graph.getCell = function() { return cell; }
            cell.hasOpenThreats = true;
            delete cell.threats;
            $scope.$apply();
            expect(cell.hasOpenThreats).toBe(false);   
            
        }     
        
        
        it('should set hasOpenThreats on the process', function() {
            
           graph.addProcess = function() { return {id: 'processId'}};
           spyOn(graph, 'addProcess').and.callThrough();
           $scope.vm.graph = graph;
           var cell = $scope.vm.newProcess();
           setOpenThreats(cell)
            
        });
        
        it('should unset hasOpenThreats on the process', function() {
            
           graph.addProcess = function() { return {id: 'processId'}};
           spyOn(graph, 'addProcess').and.callThrough();
           $scope.vm.graph = graph;
           var cell = $scope.vm.newProcess();
           setMitigatedThreats(cell);
            
        });
        
        it('should unset hasOpenThreats on the process (no threats)', function() {
            
           graph.addProcess = function() { return {id: 'processId'}};
           spyOn(graph, 'addProcess').and.callThrough();
           $scope.vm.graph = graph;
           var cell = $scope.vm.newProcess();
           setNoThreats(cell);
            
        });
        
        it('should set hasOpenThreats on the actor', function() {
            
           graph.addActor = function() { return {id: 'actorId'}};
           spyOn(graph, 'addActor').and.callThrough();
           $scope.vm.graph = graph;
           var cell = $scope.vm.newActor();
           setOpenThreats(cell)
            
        });
        
        it('should unset hasOpenThreats on the actor', function() {
            
           graph.addActor = function() { return {id: 'actorId'}};
           spyOn(graph, 'addActor').and.callThrough();           
           $scope.vm.graph = graph;
           var cell = $scope.vm.newActor();
           setMitigatedThreats(cell);
            
        });
        
        it('should unset hasOpenThreats on the actor (no threats)', function() {
            
           graph.addActor = function() { return {id: 'actorId'}};
           spyOn(graph, 'addActor').and.callThrough();           
           $scope.vm.graph = graph;
           var cell = $scope.vm.newActor();
           setNoThreats(cell);
            
        });
        
        it('should set hasOpenThreats on the store', function() {
            
           graph.addStore = function() { return {id: 'storeId'}};
           spyOn(graph, 'addStore').and.callThrough();           
           $scope.vm.graph = graph;
           var cell = $scope.vm.newStore();
           setOpenThreats(cell)
            
        });
        
        it('should unset hasOpenThreats on the store', function() {
            
           graph.addStore = function() { return {id: 'storeId'}};
           spyOn(graph, 'addStore').and.callThrough();           
           $scope.vm.graph = graph;
           var cell = $scope.vm.newStore();
           setMitigatedThreats(cell);
            
        });
        
        it('should unset hasOpenThreats on the store (no threats)', function() {
            
           graph.addStore = function() { return {id: 'storeId'}};
           spyOn(graph, 'addStore').and.callThrough();           
           $scope.vm.graph = graph;
           var cell = $scope.vm.newStore();
           setNoThreats(cell);
            
        });
        
        it('should set hasOpenThreats on the flow', function() {
            
           graph.addFlow = function() { return {id: 'flowId'}};
           spyOn(graph, 'addFlow').and.callThrough();             
           $scope.vm.graph = graph;
           var cell = $scope.vm.newFlow('source', 'target');
           setOpenThreats(cell)
            
        });
        
        it('should unset hasOpenThreats on the flow', function() {
            
           graph.addFlow = function() { return {id: 'flowId'}};
           spyOn(graph, 'addFlow').and.callThrough();             
           $scope.vm.graph = graph;
           var cell = $scope.vm.newFlow('source', 'target');
           setMitigatedThreats(cell);
            
        });
        
        it('should unset hasOpenThreats on the flow (no threats)', function() {
            
           graph.addFlow = function() { return {id: 'flowId'}};
           spyOn(graph, 'addFlow').and.callThrough();             
           $scope.vm.graph = graph;
           var cell = $scope.vm.newFlow();
           setNoThreats(cell);
            
        });

        it('should update the thumbnail after a diagram type change', function() {
            
            var type = "CIA"
            var diagram = {};
            $scope.vm.diagram = diagram
            $scope.vm.diagram.diagramType = type;
            $scope.vm.updateDiagramType();
            expect($scope.vm.diagram.thumbnail).toEqual('./public/content/images/thumbnail.cia.jpg');

            type = "LINDDUN"
            $scope.vm.diagram.diagramType = type;
            $scope.vm.updateDiagramType();
            expect($scope.vm.diagram.thumbnail).toEqual('./public/content/images/thumbnail.linddun.jpg');
            
            type = "Everything Else"
            $scope.vm.diagram.diagramType = type;
            $scope.vm.updateDiagramType();
            expect($scope.vm.diagram.thumbnail).toEqual('./public/content/images/thumbnail.stride.jpg');
         });
        
    })
        
    describe('zoom tests', function() {
        
        var mockDiagram;
        
        beforeEach(function() {
            
            mockDiagram = {};
            mockDiagram.zoom = function() { };
            spyOn(mockDiagram, 'zoom');
            $scope.vm.currentDiagram = mockDiagram;        
            
        })
        
        it('should increase the zoom level', function() {
            
            $scope.vm.maxZoom = 5;
            $scope.vm.currentZoomLevel = 1;
            $scope.vm.zoomIn();
            expect(mockDiagram.zoom).toHaveBeenCalled();
            expect(mockDiagram.zoom.calls.argsFor(0)).toEqual([2]);
            expect($scope.vm.currentZoomLevel).toEqual(2);
            
        });
        
        it('should not increase the zoom level', function() {
 
            $scope.vm.maxZoom = 5;
            $scope.vm.currentZoomLevel = 5;
            $scope.vm.zoomIn();
            expect(mockDiagram.zoom).not.toHaveBeenCalled();
            expect($scope.vm.currentZoomLevel).toEqual(5);           
               
        });
        
        it('should decrease the zoom level', function() {
            
            $scope.vm.maxZoom = 0;
            $scope.vm.currentZoomLevel = 1;
            $scope.vm.zoomOut();
            expect(mockDiagram.zoom).toHaveBeenCalled();
            expect(mockDiagram.zoom.calls.argsFor(0)).toEqual([0]);
            expect($scope.vm.currentZoomLevel).toEqual(0);
            
        });
        
        it('should not decrease the zoom level', function() {
 
            $scope.vm.maxZoom = 0;
            $scope.vm.currentZoomLevel = 0;
            $scope.vm.zoomOut();
            expect(mockDiagram.zoom).not.toHaveBeenCalled();
            expect($scope.vm.currentZoomLevel).toEqual(0);           
               
        }); 
    });

    describe('grid tests', function() {

        var mockDiagram;

        beforeEach(function() {
            
            mockDiagram = {};
            $scope.vm.currentDiagram = mockDiagram;        
            
        })
        
        it('should turn on the grid', function() {
            
            mockDiagram.drawGrid = function() {};
            spyOn(mockDiagram, 'drawGrid');
            mockDiagram.setGridSize = function() {};
            spyOn(mockDiagram, 'setGridSize');
            $scope.vm.showGrid = true;
            $scope.vm.setGrid();
            expect(mockDiagram.drawGrid).toHaveBeenCalled();
            expect(mockDiagram.setGridSize).toHaveBeenCalled();
            expect(mockDiagram.setGridSize.calls.argsFor(0)).toEqual([10]);
              
        });

        it('should turn off the grid', function() {
            
            mockDiagram.clearGrid = function() {};
            spyOn(mockDiagram, 'clearGrid');
            mockDiagram.setGridSize = function() {};
            spyOn(mockDiagram, 'setGridSize');
            $scope.vm.showGrid = false;
            $scope.vm.setGrid();
            expect(mockDiagram.clearGrid).toHaveBeenCalled();
            expect(mockDiagram.setGridSize).toHaveBeenCalled();
            expect(mockDiagram.setGridSize.calls.argsFor(0)).toEqual([1]);
            
        });


    });
    
    describe('confirmation tests: ', function() {
        
        beforeEach(function() {
            
            //dialogs mock
            mockDialogs.confirm = function() { };
            
        });
        
        it('should ask for confirmation and reload', function() {
            
            spyOn(mockDialogs, 'confirm');
            var graph = {};
            graph.cellCount = function() {};
            spyOn(graph, 'cellCount').and.returnValue(5); 
            $scope.vm.graph = graph;
            spyOn($scope.vm, 'initialise');  
            $scope.vm.dirty= true;
            $scope.vm.reload();
            expect(mockDialogs.confirm).toHaveBeenCalled()
            expect(mockDialogs.confirm.calls.argsFor(0)[0]).toEqual('diagrams/confirmReloadOnDirty.html');
            //argument 1 is onOk
            mockDialogs.confirm.calls.argsFor(0)[1]();
            expect($scope.vm.initialise).toHaveBeenCalled();
            
        });
        
        it('should reload without asking for confirmation (model not dirty)', function() {
            
            spyOn(mockDialogs, 'confirm');            
            spyOn($scope.vm, 'initialise');
            var graph = {};
            graph.cellCount = function() {};
            spyOn(graph, 'cellCount').and.returnValue(5); 
            $scope.vm.graph = graph;
            $scope.vm.dirty= false;
            $scope.vm.reload();
            expect(mockDialogs.confirm).not.toHaveBeenCalled();
            expect($scope.vm.initialise).toHaveBeenCalled();
            
        });
        
        it('should reload without asking for confirmation (empty graph)', function() {

            spyOn(mockDialogs, 'confirm'); 
            spyOn($scope.vm, 'initialise'); 
            var graph = {};
            graph.cellCount = function() {};
            spyOn(graph, 'cellCount').and.returnValue(0); 
            $scope.vm.graph = graph;
            $scope.vm.dirty= true;
            $scope.vm.reload();
            expect(mockDialogs.confirm).not.toHaveBeenCalled();
            expect($scope.vm.initialise).toHaveBeenCalled();
            
        });
    });
    
    describe('model initialisaton tests: ', function() {
        
        var newDiagram;
        var threatModel;
        var diagramId;
        var graph;
        var title;
        var mockLocation
        
        beforeEach(function() {
            
            //datacontext mock
            mockDatacontext.load = function() { return $q.when(true); };           
            newDiagram = {};

            //locator mock
            mockLocation = 'mock location';
            mockThreatModelLocator.getModelLocation = function() {};
            mockThreatModelLocator.getModelPath = function() {};
            mockThreatModelLocator.getModelPathFromRouteParams = function () { },
            spyOn(mockThreatModelLocator, 'getModelLocation').and.returnValue(mockLocation);
            spyOn(mockThreatModelLocator, 'getModelPath');
            spyOn(mockThreatModelLocator, 'getModelPathFromRouteParams');
            
            threatModel = {
                detail: {
                    diagrams: [
                        { diagramJson: 'd0', size: 's0'},
                        { diagramJson: 'd1', size: 's1'},
                        { }
                    ]
                }
            };
                
            diagramId = 1;
            graph = new joint.dia.Graph();

            $scope.vm.graph = graph;
            $scope.vm.diagramId = diagramId;
            $scope.vm.loaded = false;
            $scope.vm.dirty = true;
            
            //diagram mocks
            newDiagram.resize = function() {};
            spyOn(newDiagram, 'resize');
            
            //graph mocks
            graph.initialise = function() { };
            spyOn(graph, 'initialise');
            graph.getCells = function() { return [] };
            spyOn(graph, 'getCells').and.callThrough();

            //dialogs mock
            mockDialogs.structuredExit = function() { };
            
         });

         
        it('should get the threat model path', function() {

            $scope.vm.getThreatModelPath();
            expect(mockThreatModelLocator.getModelPathFromRouteParams).toHaveBeenCalled();
            expect(mockThreatModelLocator.getModelPathFromRouteParams.calls.argsFor(0)).toEqual([mockRouteParams]);

        });
    
        it('should initialise a model with Json and size', function() {
            
            spyOn(mockDatacontext, 'load').and.returnValue($q.when(threatModel));           

            //$routeParams mock
            mockRouteParams.organisation = mockOrg;
            mockRouteParams.repo = mockRepo;
            mockRouteParams.branch = mockBranch;
            mockRouteParams.model = mockModelName;
            
            var forceQuery = 'force query';
            
            $scope.vm.initialise(newDiagram, forceQuery);
            $scope.$apply();
            
            expect(mockDatacontext.load).toHaveBeenCalled();
            expect(mockDatacontext.load.calls.argsFor(0)).toEqual([mockLocation, forceQuery]);
            expect(mockThreatModelLocator.getModelLocation.calls.argsFor(0)[0].organisation).toEqual(mockOrg);
            expect(mockThreatModelLocator.getModelLocation.calls.argsFor(0)[0].repo).toEqual(mockRepo);
            expect(mockThreatModelLocator.getModelLocation.calls.argsFor(0)[0].branch).toEqual(mockBranch);
            expect(mockThreatModelLocator.getModelLocation.calls.argsFor(0)[0].model).toEqual(mockModelName);
            expect(graph.initialise).toHaveBeenCalled();
            expect(graph.initialise.calls.argsFor(0)).toEqual([threatModel.detail.diagrams[1].diagramJson]);
            expect(newDiagram.resize).toHaveBeenCalled();
            expect(newDiagram.resize.calls.argsFor(0)).toEqual([threatModel.detail.diagrams[1].size]);
            expect($scope.vm.loaded).toBe(true);
            expect($scope.vm.dirty).toBe(false);
            expect($scope.vm.diagram.title).toEqual(title);
                 
        })
        
        it('should initialise a model without Json and size', function() {
            
            //$routeParams mock
            mockRouteParams.organisation = mockOrg;
            mockRouteParams.repo = mockRepo;
            mockRouteParams.branch = mockBranch;
            mockRouteParams.model = mockModelName;
            
            var forceQuery = 'force query';
            $scope.vm.diagramId = 2;
            spyOn(mockDatacontext, 'load').and.returnValue($q.when(threatModel));           
            $scope.vm.initialise(newDiagram, forceQuery);
            $scope.$apply();
            
            expect(mockDatacontext.load).toHaveBeenCalled();
            expect(mockDatacontext.load.calls.argsFor(0)).toEqual([mockLocation, forceQuery]);
            expect(mockThreatModelLocator.getModelLocation.calls.argsFor(0)[0].organisation).toEqual(mockOrg);
            expect(mockThreatModelLocator.getModelLocation.calls.argsFor(0)[0].repo).toEqual(mockRepo);
            expect(mockThreatModelLocator.getModelLocation.calls.argsFor(0)[0].branch).toEqual(mockBranch);
            expect(mockThreatModelLocator.getModelLocation.calls.argsFor(0)[0].model).toEqual(mockModelName);
            expect(graph.initialise).not.toHaveBeenCalled();
            expect(newDiagram.resize).not.toHaveBeenCalled();
            expect($scope.vm.loaded).toBe(true);
            expect($scope.vm.dirty).toBe(false);
            expect($scope.vm.diagram.title).toEqual(title);
        })
        
        it('should initialise a model and select the specified element', function() {
            
            spyOn(mockDatacontext, 'load').and.returnValue($q.when(threatModel));           
            var elementId = 'elementId';
            mockRouteParams.element = elementId;
            var element = {id: elementId};
            graph.getCellById = function() { return element; };
            spyOn(graph, 'getCellById').and.callThrough();
            newDiagram.setSelected = function() {};
            spyOn(newDiagram, 'setSelected');
            $scope.vm.viewStencil = true;
            $scope.vm.viewThreats = false;
            $scope.vm.initialise(newDiagram);
            $timeout.flush();
            $scope.$apply();
            
            expect($scope.vm.selected).toEqual(element);
            expect(graph.getCellById).toHaveBeenCalled();
            expect(graph.getCellById.calls.argsFor(0)).toEqual([elementId]);
            expect(newDiagram.setSelected).toHaveBeenCalled();
            expect(newDiagram.setSelected.calls.argsFor(0)).toEqual([element]);
            expect($scope.vm.viewStencil).toBe(false);
            expect($scope.vm.viewThreats).toBe(true);
         
        })
        
        it('should error and not load a model', function() {
            
            var errorMessage = 'error message';
            spyOn(mockDatacontext, 'load').and.returnValue($q.reject(errorMessage)); 
            $scope.vm.initialise(newDiagram);
            $scope.$apply();           
                      
            expect($scope.vm.loaded).toBe(false);
            
        });
        
        it('should add a change/add event handler to the graph', function() {
            
            spyOn(mockDatacontext, 'load').and.returnValue($q.when(threatModel));           
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
            
            spyOn(mockDatacontext, 'load').and.returnValue($q.when(threatModel));           
            $scope.vm.initialise(newDiagram);
            $scope.$apply();
            expect($scope.vm.dirty).toBe(false);
            
            rect.remove();

            expect($scope.vm.dirty).toBe(true); 
            expect($scope.vm.selected).toBeNull();
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
        var methodology;
        
        beforeEach(function() {
     
            element = {threats: []};       

        });
        
        it('should generate threats for the specified element', function() {
            
            var threats = ['threat1', 'threat2', 'threat3'];
            var currentThreat = threats[0];
            mockThreatEngine.generatePerElement = function() { return $q.when(threats); };
            spyOn(mockThreatEngine, 'generatePerElement').and.callThrough();
            mockDialogs.confirm = function() {};
            spyOn(mockDialogs, 'confirm');
            
            $scope.vm.selected = element;
            $scope.vm.generateThreats()
            $scope.$apply();
            
            expect(mockThreatEngine.generatePerElement).toHaveBeenCalled();
            expect(mockThreatEngine.generatePerElement.calls.argsFor(0)).toEqual([element, methodology]);
            expect(mockDialogs.confirm).toHaveBeenCalled();
            expect(mockDialogs.confirm.calls.argsFor(0)[0]).toEqual('diagrams/StrideEditPane.html');
            //argument 2 contains the supplied threat
            expect(mockDialogs.confirm.calls.argsFor(0)[2]().threat).toEqual(currentThreat);
            expect(threats.length).toEqual(2);
        });
        
        it('should generate no threats', function() {
            
            var threats = [];
            mockThreatEngine.generatePerElement = function() { return $q.when(threats); };
            spyOn(mockThreatEngine, 'generatePerElement').and.callThrough();
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
            mockThreatEngine.generatePerElement = function() { return $q.when(threats); };
            spyOn(mockThreatEngine, 'generatePerElement').and.callThrough();
            mockDialogs.confirm = function() {};
            spyOn(mockDialogs, 'confirm');
            $scope.vm.dirty = false;
            
            $scope.vm.selected = element;
            $scope.vm.generateThreats()
            $scope.$apply();
            
            //argument 0 is confirm - OK/Accept
            mockDialogs.confirm.calls.argsFor(0)[1]();
            $timeout.flush();
            
            expect($scope.vm.selected.threats).toEqual([currentThreat]);
            expect(mockDialogs.confirm.calls.count()).toEqual(2);
            expect($scope.vm.dirty).toBe(true);
        });
        
        it('should add threats to the element', function() {
            
            var threats = ['threat1', 'threat2', 'threat3'];
            var currentThreat = threats[0];
            mockThreatEngine.generatePerElement = function() { return $q.when(threats); };
            spyOn(mockThreatEngine, 'generatePerElement').and.callThrough();
            mockDialogs.confirm = function() {};
            spyOn(mockDialogs, 'confirm');
            $scope.vm.dirty = false;
            
            $scope.vm.selected = element;
            $scope.vm.generateThreats()
            $scope.$apply();
            
            //argument 0 is confirm - OK/Accept
            mockDialogs.confirm.calls.argsFor(0)[1](true);
            $timeout.flush();
            threats.unshift(currentThreat);
            expect($scope.vm.selected.threats).toEqual(threats);
            expect(mockDialogs.confirm.calls.count()).toEqual(1);
            expect($scope.vm.dirty).toBe(true);            
            
        });
        
        it('should not add a threat to the element', function() {
            
            var threats = ['threat1', 'threat2', 'threat3'];
            mockThreatEngine.generatePerElement = function() { return $q.when(threats); };
            spyOn(mockThreatEngine, 'generatePerElement').and.callThrough();
            mockDialogs.confirm = function() {};
            spyOn(mockDialogs, 'confirm');
            $scope.vm.dirty = false;
            
            $scope.vm.selected = element;
            $scope.vm.generateThreats()
            $scope.$apply();
            
            //argument 3 is confirm - Cancel/Ignore
            mockDialogs.confirm.calls.argsFor(0)[3]();
            $timeout.flush();
            
            expect($scope.vm.selected.threats).toEqual([]);
            expect(mockDialogs.confirm.calls.count()).toEqual(2);
            expect($scope.vm.dirty).toBe(false);
        });
        
        it('should not add a threat to the element', function() {
            
            var threats = ['threat1', 'threat2', 'threat3'];
            mockThreatEngine.generatePerElement = function() { return $q.when(threats); };
            spyOn(mockThreatEngine, 'generatePerElement').and.callThrough();
            mockDialogs.confirm = function() {};
            spyOn(mockDialogs, 'confirm');
            $scope.vm.dirty = false;
            
            $scope.vm.selected = element;
            $scope.vm.generateThreats()
            $scope.$apply();
            
            //argument 3 is confirm - Cancel/Ignore
            mockDialogs.confirm.calls.argsFor(0)[3](true);
            $timeout.flush();
            
            expect($scope.vm.selected.threats).toEqual([]);
            expect(mockDialogs.confirm.calls.count()).toEqual(1);
            expect($scope.vm.dirty).toBe(false);
        });
    });
});
