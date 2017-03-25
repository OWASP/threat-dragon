'use strict';

var joint = require('jointjs');

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
    var mockOrg = 'org';
    var mockRepo = 'repo';
    var mockBranch = 'branch';
    var mockModelName = 'model name';
    var mockDiagramId = 'diagam';
    
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
        
        it('should clear all elements and links', function() {
           
           var graph = {title: 'test graph'};
           graph.clearAll = function() { };
           spyOn(graph, 'clearAll');
           $scope.vm.graph = graph;
           $scope.vm.clear();
           expect(graph.clearAll).toHaveBeenCalled();
            
        });
        
        it('should add a new process', function() {
           
           var graph = {title: 'test graph'};
           graph.addProcess = function() { return {id: 'processId'}};
           spyOn(graph, 'addProcess').and.callThrough();
           $scope.vm.graph = graph;
           $scope.vm.newProcess();
           expect(graph.addProcess).toHaveBeenCalled();
            
        });
        
        it('should add a new actor', function() {
           
           var graph = {title: 'test graph'};
           graph.addActor = function() { return {id: 'actorId'}};
           spyOn(graph, 'addActor').and.callThrough();
           $scope.vm.graph = graph;
           $scope.vm.newActor();
           expect(graph.addActor).toHaveBeenCalled();
            
        });
        
        it('should add a new store', function() {
 
           var graph = {title: 'test graph'};
           graph.addStore = function() { return {id: 'storeId'}};
           spyOn(graph, 'addStore').and.callThrough();
           $scope.vm.graph = graph;       
           $scope.vm.newStore();
           expect(graph.addStore).toHaveBeenCalled();
            
        });
        
        it('should add a new boundary', function() {
            
           var graph = {title: 'test graph'};
           graph.addBoundary = function() { return {id: 'boundaryId'}};
           spyOn(graph, 'addBoundary').and.callThrough();
           $scope.vm.graph = graph;  
           $scope.vm.newBoundary();
           expect(graph.addBoundary).toHaveBeenCalled();
            
        });
        
        it('should add a new flow', function() {
            
           var graph = {title: 'test graph'};
           var source = 'source';
           var target = 'target';
           graph.addFlow = function() { return {id: 'flowId'}};
           spyOn(graph, 'addFlow').and.callThrough();  
           $scope.vm.graph = graph;
           $scope.vm.newFlow(source, target);
           expect(graph.addFlow).toHaveBeenCalled();
           expect(graph.addFlow.calls.argsFor(0)).toEqual([source, target]);
            
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
            
           var graph = {title: 'test graph'};
           graph.addProcess = function() { return {id: 'processId'}};
           spyOn(graph, 'addProcess').and.callThrough();
           $scope.vm.graph = graph;
           var cell = $scope.vm.newProcess();
           setOpenThreats(cell)
            
        });
        
        it('should unset hasOpenThreats on the process', function() {
            
           var graph = {title: 'test graph'};
           graph.addProcess = function() { return {id: 'processId'}};
           spyOn(graph, 'addProcess').and.callThrough();
           $scope.vm.graph = graph;
           var cell = $scope.vm.newProcess();
           setMitigatedThreats(cell);
            
        });
        
        it('should unset hasOpenThreats on the process (no threats)', function() {
            
           var graph = {title: 'test graph'};
           graph.addProcess = function() { return {id: 'processId'}};
           spyOn(graph, 'addProcess').and.callThrough();
           $scope.vm.graph = graph;
           var cell = $scope.vm.newProcess();
           setNoThreats(cell);
            
        });
        
        it('should set hasOpenThreats on the actor', function() {
            
           var graph = {title: 'test graph'};
           graph.addActor = function() { return {id: 'actorId'}};
           spyOn(graph, 'addActor').and.callThrough();
           $scope.vm.graph = graph;
           var cell = $scope.vm.newActor();
           setOpenThreats(cell)
            
        });
        
        it('should unset hasOpenThreats on the actor', function() {
            
           var graph = {title: 'test graph'};
           graph.addActor = function() { return {id: 'actorId'}};
           spyOn(graph, 'addActor').and.callThrough();           
           $scope.vm.graph = graph;
           var cell = $scope.vm.newActor();
           setMitigatedThreats(cell);
            
        });
        
        it('should unset hasOpenThreats on the actor (no threats)', function() {
            
           var graph = {title: 'test graph'};
           graph.addActor = function() { return {id: 'actorId'}};
           spyOn(graph, 'addActor').and.callThrough();           
           $scope.vm.graph = graph;
           var cell = $scope.vm.newActor();
           setNoThreats(cell);
            
        });
        
        it('should set hasOpenThreats on the store', function() {
            
           var graph = {title: 'test graph'};
           graph.addStore = function() { return {id: 'storeId'}};
           spyOn(graph, 'addStore').and.callThrough();           
           $scope.vm.graph = graph;
           var cell = $scope.vm.newStore();
           setOpenThreats(cell)
            
        });
        
        it('should unset hasOpenThreats on the store', function() {
            
           var graph = {title: 'test graph'};
           graph.addStore = function() { return {id: 'storeId'}};
           spyOn(graph, 'addStore').and.callThrough();           
           $scope.vm.graph = graph;
           var cell = $scope.vm.newStore();
           setMitigatedThreats(cell);
            
        });
        
        it('should unset hasOpenThreats on the store (no threats)', function() {
            
           var graph = {title: 'test graph'};
           graph.addStore = function() { return {id: 'storeId'}};
           spyOn(graph, 'addStore').and.callThrough();           
           $scope.vm.graph = graph;
           var cell = $scope.vm.newStore();
           setNoThreats(cell);
            
        });
        
        it('should set hasOpenThreats on the flow', function() {
            
           var graph = {title: 'test graph'};
           graph.addFlow = function() { return {id: 'flowId'}};
           spyOn(graph, 'addFlow').and.callThrough();             
           $scope.vm.graph = graph;
           var cell = $scope.vm.newFlow('source', 'target');
           setOpenThreats(cell)
            
        });
        
        it('should unset hasOpenThreats on the flow', function() {
            
           var graph = {title: 'test graph'};
           graph.addFlow = function() { return {id: 'flowId'}};
           spyOn(graph, 'addFlow').and.callThrough();             
           $scope.vm.graph = graph;
           var cell = $scope.vm.newFlow('source', 'target');
           setMitigatedThreats(cell);
            
        });
        
        it('should unset hasOpenThreats on the flow (no threats)', function() {
            
           var graph = {title: 'test graph'};
           graph.addFlow = function() { return {id: 'flowId'}};
           spyOn(graph, 'addFlow').and.callThrough();             
           $scope.vm.graph = graph;
           var cell = $scope.vm.newFlow();
           setNoThreats(cell);
            
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
        var diagramData;
        
        beforeEach(function() {
            
            //datacontext mock
            mockDatacontext.load = function() { return $q.when(true); };           
            newDiagram = {};
            
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
            
         })
    
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
            expect(mockDatacontext.load.calls.argsFor(0)[0].organisation).toEqual(mockOrg);
            expect(mockDatacontext.load.calls.argsFor(0)[0].repo).toEqual(mockRepo);
            expect(mockDatacontext.load.calls.argsFor(0)[0].branch).toEqual(mockBranch);
            expect(mockDatacontext.load.calls.argsFor(0)[0].model).toEqual(mockModelName);
            expect(mockDatacontext.load.calls.argsFor(0)[1]).toEqual(forceQuery);
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
            expect(mockDatacontext.load.calls.argsFor(0)[0].organisation).toEqual(mockOrg);
            expect(mockDatacontext.load.calls.argsFor(0)[0].repo).toEqual(mockRepo);
            expect(mockDatacontext.load.calls.argsFor(0)[0].branch).toEqual(mockBranch);
            expect(mockDatacontext.load.calls.argsFor(0)[0].model).toEqual(mockModelName);
            expect(mockDatacontext.load.calls.argsFor(0)[1]).toEqual(forceQuery);
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
        
        beforeEach(function() {
     
            element = {threats: []};       

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
            expect(mockDialogs.confirm.calls.argsFor(0)[0]).toEqual('diagrams/ThreatEditPane.html');
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
            mockThreatEngine.generateForElement = function() { return $q.when(threats); };
            spyOn(mockThreatEngine, 'generateForElement').and.callThrough();
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
            mockThreatEngine.generateForElement = function() { return $q.when(threats); };
            spyOn(mockThreatEngine, 'generateForElement').and.callThrough();
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
            mockThreatEngine.generateForElement = function() { return $q.when(threats); };
            spyOn(mockThreatEngine, 'generateForElement').and.callThrough();
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