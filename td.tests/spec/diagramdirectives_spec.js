'use strict';

describe('stencil directive: ', function() {
    
    var $rootScope;
    var $scope;
    var $compile;
    var $httpBackend;
    var elem;
    
    beforeEach(function() {
      
        angular.mock.module('app');
        angular.mock.inject(function (_$rootScope_, _$compile_, _$httpBackend_) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $compile = _$compile_;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET().respond();
        });

        $rootScope.$apply();  
        
        $scope.action = function() {};
        spyOn($scope,'action');
        
    });
    
    describe('element stencil tests: ', function() {

        beforeEach(function() {
            
            var shapeType = 'joint.shapes.tm.Process';
            var shapeLabel = 'shape-label';
            $scope.shape = {className: shapeType, label: shapeLabel};
                
        });
        
        it('should set default padding', function() {
        
            setFixtures('<tmt-stencil action="action()" shape="shape" />');
            elem = angular.element($('tmt-stencil')[0]);
            $compile(elem)($scope);
            $scope.$digest();
            
            expect(elem.isolateScope().padding).toEqual(0.0);
        
        });  
    
        it('should set default scale', function() {
            
            setFixtures('<tmt-stencil action="action()" shape="shape" />');
            elem = angular.element($('tmt-stencil')[0]);
            $compile(elem)($scope);
            $scope.$digest();
            
            expect(elem.isolateScope().scale).toEqual(1.0);
        
        });
        
        it('should use the supplied scale and padding', function(){

            setFixtures('<tmt-stencil action="action()" scale="2.0"padding="10.0" shape="shape" />');
            elem = angular.element($('tmt-stencil')[0]);
            $compile(elem)($scope);
            $scope.$digest();
            
            expect(elem.isolateScope().scale).toEqual(2.0);
            expect(elem.isolateScope().padding).toEqual(10.0);         
            
        });
        
        it('should contain the specified element', function() {

            setFixtures('<tmt-stencil action="action()" scale="2.0"padding="10.0" shape="shape" />');
            elem = angular.element($('tmt-stencil')[0]);
            $compile(elem)($scope);
            $scope.$digest();
            
            expect($(elem).find('.element.tm.Process').length).toEqual(1);
            var label = $(elem).find('text').find('tspan');         
            expect(label[0]).toContainText($scope.shape.label);
            
        });
    });
    
    describe('link stencil tests: ', function() {
        
        beforeEach(function() {
            
            var shapeType = 'joint.shapes.tm.Flow';
            var shapeLabel = 'shape-label';
            $scope.shape = {className: shapeType, label: shapeLabel};
                
        });
        
        it('should contain the specified link', function() {

            setFixtures('<tmt-stencil action="action()" scale="2.0"padding="10.0" shape="shape" />');
            elem = angular.element($('tmt-stencil')[0]);
            $compile(elem)($scope);
            $scope.$digest();
            
            expect($(elem).find('.tm.Flow.link').length).toEqual(1);
            var label = $(elem).find('text').find('tspan');         
            expect(label[0]).toContainText($scope.shape.label);
            
        });       
    })
});

describe('diagram directive: ', function() {
    
    var $rootScope;
    var $scope;
    var $compile;
    var $httpBackend;
    var elem;
    
    beforeEach(function() {
      
        angular.mock.module('app');
        angular.mock.inject(function (_$rootScope_, _$compile_, _$httpBackend_) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $compile = _$compile_;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET().respond();
        });

        $rootScope.$apply();  
        
        $scope.action = function() {};
        spyOn($scope,'action');
        
    });
        
    describe('basic settings: ',function() {
        
        var height;
        var width;
        var gridSize;
        var interactive;
        var diagramSvg;
        var viewport;     
        
        beforeEach(function() {
            
            height = 400;
            width = 600;
            gridSize = 2;
            interactive = true;
            
            //graph mocks
            var graph = new joint.dia.Graph();;
            $scope.graph = graph;
            spyOn(graph, 'on').and.callThrough();
            $scope.initialiseGraph = function() {};
            spyOn($scope, 'initialiseGraph');
            $scope.select = function(element) { };
            spyOn($scope, 'select');
            
            setFixtures('<tmt-diagram height="' + height + '" width="' + width + '" grid-size="' + gridSize + '" interactive="' + interactive + '" graph="graph" initialise-graph="initialiseGraph(diagram)" select="select(element)" />');
            elem = angular.element($('tmt-diagram')[0]);
            $compile(elem)($scope);
            $scope.$digest();
            diagramSvg = $(elem).children('svg');
            viewport = diagramSvg.children('.viewport');
            
        });
    
        it('should create a diagram', function() {
            
            expect(diagramSvg.length).toEqual(1);
            expect(viewport.length).toEqual(1);
            expect($scope.initialiseGraph).toHaveBeenCalled();
        
        });
        
        it('should use the height', function() {
            
            expect(elem.isolateScope().height).toEqual(height);
            //jasmine-jquery toHaveAttr does not work for SVG
            expect(diagramSvg.attr('height')).toEqual((height - 10).toString());
            
        });  
        
        it('should use the width', function() {
            
            expect(elem.isolateScope().width).toEqual(width);
            //jasmine-jquery toHaveAttr does not work for SVG
            expect(diagramSvg.attr('width')).toEqual((width - 10).toString());
            
        });   
        
        it('should use the grid size', function() {
            
            expect(elem.isolateScope().gridSize).toEqual(gridSize);
            
        });
        
        it('should use the interactive value', function() {
            
            expect(elem.isolateScope().interactive).toEqual(interactive);
            
        });
        
        it('should move the added cell according to the viewport scroll', function() {
            
            var cell = new joint.shapes.basic.Rect();
            spyOn(cell, 'translate');
            $scope.graph.trigger('add', cell);
            expect(cell.translate).toHaveBeenCalled();
            expect(cell.translate.calls.argsFor(0)).toEqual([0,0]);
            
        });
        
        describe('selection tests: ',function() {
            
            var diagram;
            
            beforeEach(function() {
                
                diagram = $scope.initialiseGraph.calls.argsFor(0)[0];
                
            });
                
            it('should select a cell', function() {
                
                var cell = new joint.shapes.basic.Rect();
                $scope.graph.addCell(cell);
                var cellView = diagram.findViewByModel(cell);
                diagram.trigger('cell:pointerclick', cellView);
                expect($scope.select).toHaveBeenCalled();
                expect($scope.select.calls.argsFor(0)).toEqual([cell]);
                
            });
            
            it('should select a link', function() {
                
                var link = new joint.shapes.tm.Flow( {source: {x: 1, y: 1}, target: {x:100, y:100}});
                $scope.graph.addCell(link);
                var cellView = diagram.findViewByModel(link);
                diagram.trigger('link:options', {}, cellView);
                expect($scope.select).toHaveBeenCalled();
                expect($scope.select.calls.argsFor(0)).toEqual([link]);
                
            });
            
            it('should unselect a cell', function() {
                
                diagram.trigger('blank:pointerclick');
                expect($scope.select).toHaveBeenCalled();
                expect($scope.select.calls.argsFor(0)).toEqual([null]);
                
            });
        });
    });
});