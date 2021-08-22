'use strict';

var $ = require('jquery');
var joint = require('jointjs');

describe('core stencil directive: ', function () {

    var $rootScope;
    var $scope;
    var $compile;
    var $httpBackend;
    var diagramming;
    var elem;

    beforeEach(function () {

        angular.mock.module('tdCore');

        angular.mock.inject(function (_$rootScope_, _$compile_, _$httpBackend_, _diagramming_) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $compile = _$compile_;
            diagramming = _diagramming_;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET().respond();
        });

        $rootScope.$apply();

        $scope.action = function () { };
        spyOn($scope, 'action');

    });

    describe('element stencil tests: ', function () {

        beforeEach(function () {

            $scope.shape = { getElement: function () { return new diagramming.Process(); }, label: 'Process' };

        });

        it('should set default padding', function () {

            setFixtures('<tmt-stencil action="action()" shape="shape" />');
            elem = angular.element($('tmt-stencil')[0]);
            $compile(elem)($scope);
            $scope.$digest();

            expect(elem.isolateScope().padding).toEqual(0.0);

        });

        it('should set default scale', function () {

            setFixtures('<tmt-stencil action="action()" shape="shape" />');
            elem = angular.element($('tmt-stencil')[0]);
            $compile(elem)($scope);
            $scope.$digest();

            expect(elem.isolateScope().scale).toEqual(1.0);

        });

        it('should use the supplied scale and padding', function () {

            setFixtures('<tmt-stencil action="action()" scale="2.0"padding="10.0" shape="shape" />');
            elem = angular.element($('tmt-stencil')[0]);
            $compile(elem)($scope);
            $scope.$digest();

            expect(elem.isolateScope().scale).toEqual(2.0);
            expect(elem.isolateScope().padding).toEqual(10.0);

        });

        it('should contain the specified element', function () {

            setFixtures('<tmt-stencil action="action()" scale="2.0"padding="10.0" shape="shape" />');
            elem = angular.element($('tmt-stencil')[0]);
            $compile(elem)($scope);
            $scope.$digest();

            if (navigator.userAgent.indexOf('PhantomJS') < 0) {
                expect($(elem).find("[data-type='tm.Process']").length).toEqual(1);
            } else {
                //weaker test for PhantomJS since it does something funny with SVG classes
                expect($(elem).find('[model-id]').length).toEqual(1);
            }
            var label = $(elem).find('text').find('tspan');
            expect(label[0]).toContainText($scope.shape.label);

        });
    });

    describe('link stencil tests: ', function () {

        beforeEach(function () {

            $scope.shape = $scope.shape = { getElement: function () { return new diagramming.Flow(); }, label: 'Flow' };

        });

        it('should contain the specified link', function () {

            setFixtures('<tmt-stencil action="action()" scale="2.0"padding="10.0" shape="shape" />');
            elem = angular.element($('tmt-stencil')[0]);
            $compile(elem)($scope);
            $scope.$digest();

            if (navigator.userAgent.indexOf('PhantomJS') < 0) {
                expect($(elem).find("[data-type='tm.Flow']").length).toEqual(1);
            } else {
                //weaker test for PhantomJS since it does something funny with SVG classes
                expect($(elem).find('[model-id]').length).toEqual(1);
            }

            var label = $(elem).find('text').find('tspan');
            expect(label[0]).toContainText($scope.shape.label);

        });
    })
});

describe('core diagram directive: ', function () {

    var $rootScope;
    var $scope;
    var $compile;
    var $httpBackend;
    var diagramming;
    var elem;

    beforeEach(function () {

        angular.mock.module('tdCore');
        angular.mock.inject(function (_$rootScope_, _$compile_, _$httpBackend_, _diagramming_) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $compile = _$compile_;
            diagramming = _diagramming_;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET().respond();
        });

        $rootScope.$apply();

        $scope.action = function () { };
        spyOn($scope, 'action');

    });

    describe('basic settings: ', function () {

        var height;
        var width;
        var gridSize;
        var interactive;
        var diagramSvg;
        var viewport;

        beforeEach(function () {

            height = 400;
            width = 600;
            gridSize = 2;
            interactive = true;

            //graph mocks
            var graph = new joint.dia.Graph();;
            spyOn(graph, 'on').and.callThrough();

            //scope mocks
            $scope.graph = graph;
            $scope.initialiseGraph = function () { };
            spyOn($scope, 'initialiseGraph');
            $scope.select = function (element) { };
            spyOn($scope, 'select');
            $scope.newFlow = function () { };
            spyOn($scope, 'newFlow');

            setFixtures('<tmt-diagram height="' + height + '" width="' + width + '" grid-size="' + gridSize + '" interactive="' + interactive + '" graph="graph" initialise-graph="initialiseGraph(diagram)" select="select(element)" new-flow="newFlow(source, target)" />');
            elem = angular.element($('tmt-diagram')[0]);
            $compile(elem)($scope);
            $scope.$digest();
            diagramSvg = $(elem).find('svg');
            viewport = diagramSvg.children('.joint-viewport');

        });

        it('should create a diagram', function () {

            expect(diagramSvg.length).toEqual(1);
            expect(viewport.length).toEqual(1);
            expect($scope.initialiseGraph).toHaveBeenCalled();

        });

        it('should use the height', function () {

            expect(elem.isolateScope().height).toEqual(height);
            //jasmine-jquery toHaveAttr does not work for SVG
            expect(diagramSvg.attr('height')).toEqual('100%');

        });

        it('should use the width', function () {

            expect(elem.isolateScope().width).toEqual(width);
            //jasmine-jquery toHaveAttr does not work for SVG
            expect(diagramSvg.attr('width')).toEqual('100%');

        });

        it('should use the grid size', function () {

            expect(elem.isolateScope().gridSize).toEqual(gridSize);

        });

        it('should use the interactive value', function () {

            expect(elem.isolateScope().interactive).toEqual(interactive);

        });

        it('should move the added cell according to the viewport scroll', function () {

            var cell = new joint.shapes.basic.Rect();
            spyOn(cell, 'translate');
            $scope.graph.trigger('add', cell);
            expect(cell.translate).toHaveBeenCalled();
            expect(cell.translate.calls.argsFor(0)).toEqual([0, 0]);

        });

        describe('interaction tests: ', function () {

            var diagram;

            beforeEach(function () {

                diagram = $scope.initialiseGraph.calls.argsFor(0)[0];

            });

            it('should select a cell', function () {

                var cell = new joint.shapes.basic.Rect();
                $scope.graph.addCell(cell);
                var cellView = diagram.findViewByModel(cell);
                diagram.trigger('cell:pointerclick', cellView);
                expect($scope.select).toHaveBeenCalled();
                expect($scope.select.calls.argsFor(0)).toEqual([cell]);

            });

            it('should select a link', function () {

                var link = new joint.dia.Link({ source: { x: 1, y: 1 }, target: { x: 100, y: 100 } });
                $scope.graph.addCell(link);
                var cellView = diagram.findViewByModel(link);
                diagram.trigger('link:options', cellView, {});
                expect($scope.select).toHaveBeenCalled();
                expect($scope.select.calls.argsFor(0)).toEqual([link]);

            });

            it('should unselect a cell', function () {

                var cell = new joint.shapes.basic.Rect();
                $scope.graph.addCell(cell);
                var cellView = diagram.findViewByModel(cell);
                cellView.setSelected = function () { };
                cellView.setUnselected = function () { };
                cellView.removeLinkFrom = function () { };
                spyOn(cellView, 'setUnselected');
                diagram.setSelected(cell);
                diagram.trigger('blank:pointerclick');
                expect($scope.select).toHaveBeenCalled();
                expect($scope.select.calls.argsFor(0)).toEqual([null]);

            });

            it('should remove the link-from from a selected element when unselecting', function () {

                var cell = new joint.shapes.basic.Rect();
                $scope.graph.addCell(cell);
                var cellView = diagram.findViewByModel(cell);
                cellView.removeLinkFrom = function () { };
                cellView.setSelected = function () { };
                diagram.setSelected(cell);
                spyOn(cellView, 'removeLinkFrom');
                diagram.trigger('blank:pointerclick', null);
                expect(cellView.removeLinkFrom).toHaveBeenCalled();
            });

            it('should replace the selected element', function () {

                var cell1 = new joint.shapes.basic.Rect();
                var cell2 = new joint.shapes.basic.Rect();
                $scope.graph.addCells([cell1, cell2]);
                var cellView1 = diagram.findViewByModel(cell1);
                var cellView2 = diagram.findViewByModel(cell2);
                diagram.trigger('cell:pointerclick', cellView1);
                diagram.trigger('cell:pointerclick', cellView2);
                expect($scope.select.calls.count()).toEqual(2);
                expect($scope.select.calls.argsFor(1)).toEqual([cell2]);

            });

            it('should set/unset the selected properties', function () {

                var cell1 = new joint.shapes.basic.Rect();
                var cell2 = new joint.shapes.basic.Rect();
                $scope.graph.addCells([cell1, cell2]);
                var cellView1 = diagram.findViewByModel(cell1);
                cellView1.setSelected = function () { };
                cellView1.setUnselected = function () { };
                var cellView2 = diagram.findViewByModel(cell2);
                cellView2.setSelected = function () { };
                diagram.setSelected(cell1);
                spyOn(cellView1, 'setUnselected');
                spyOn(cellView2, 'setSelected');
                diagram.setSelected(cell2);
                expect(cellView1.setUnselected).toHaveBeenCalled();
                expect(cellView2.setSelected).toHaveBeenCalled();

            });

            it('should unset the selected property', function () {

                var cell = new joint.shapes.basic.Rect();
                $scope.graph.addCell(cell);
                var cellView = diagram.findViewByModel(cell);
                cellView.setSelected = function () { };
                cellView.setUnselected = function () { };
                diagram.setSelected(cell);
                spyOn(cellView, 'setUnselected');
                diagram.setSelected(null);
                expect(cellView.setUnselected).toHaveBeenCalled();

            });

            it('should set the link-from', function () {

                var cell = new joint.shapes.basic.Rect();
                $scope.graph.addCell(cell);
                var cellView = diagram.findViewByModel(cell);
                cellView.addLinkFrom = function () { };
                spyOn(cellView, 'addLinkFrom');
                cellView._action = 'linkFrom';
                diagram.trigger('cell:pointerclick', cellView);
                expect(cellView.addLinkFrom).toHaveBeenCalled();

            });

            it('should unset the link-from (tool element)', function () {

                var cell = new joint.shapes.basic.Rect();
                $scope.graph.addCell(cell);
                var cellView = diagram.findViewByModel(cell);
                cellView.setSelected = function () { };
                cellView.removeLinkFrom = function () { };
                spyOn(cellView, 'removeLinkFrom');
                diagram.setSelected(cell);
                cellView._action = 'removeLinkFrom';
                diagram.trigger('cell:pointerclick', cellView);
                expect(cellView.removeLinkFrom).toHaveBeenCalled();

            });

            it('should unset the link-from (link select)', function () {

                var cell = new joint.shapes.basic.Rect();
                var link = new joint.dia.Link({ source: { x: 1, y: 1 }, target: { x: 100, y: 100 } });
                $scope.graph.addCell([cell, link]);
                var cellView = diagram.findViewByModel(cell);
                cellView.setSelected = function () { };
                cellView.removeLinkFrom = function () { };
                spyOn(cellView, 'removeLinkFrom');
                diagram.setSelected(cell);
                var linkView = diagram.findViewByModel(link);
                diagram.trigger('link:options', linkView);
                expect(cellView.removeLinkFrom).toHaveBeenCalled();

            });

            it('should link the selected elements', function () {

                var cell1 = new joint.shapes.basic.Rect();
                var cell2 = new joint.shapes.basic.Rect();
                $scope.graph.addCells([cell1, cell2]);
                var cellView1 = diagram.findViewByModel(cell1);
                cellView1.setSelected = function () { };
                cellView1.removeLinkFrom = function () { };
                spyOn(cellView1, 'removeLinkFrom');
                var cellView2 = diagram.findViewByModel(cell2);
                diagram.setSelected(cell1);
                cellView1.linkFrom = true;
                diagram.trigger('cell:pointerclick', cellView2);
                expect(cellView1.removeLinkFrom).toHaveBeenCalled();
                expect($scope.newFlow).toHaveBeenCalled();
                expect($scope.newFlow.calls.argsFor(0)[0].cid).toEqual(cell1.cid);
                expect($scope.newFlow.calls.argsFor(0)[1].cid).toEqual(cell2.cid);

            });
        });
    });
    describe('resize and scroll: ', function () {

        var height;
        var width;
        var gridSize;
        var interactive;
        var diagram;
        var cell;
        var cellView;
        var parent;

        beforeEach(function () {

            height = 400;
            width = 600;
            gridSize = 4;
            interactive = true;

            //graph mocks
            var graph = new joint.dia.Graph();;
            spyOn(graph, 'on').and.callThrough();

            //scope mocks
            $scope.graph = graph;
            $scope.initialiseGraph = function () { };
            spyOn($scope, 'initialiseGraph');
            $scope.select = function (element) { };
            spyOn($scope, 'select');

        });

        describe('Actor resize and scroll: ', function () {

            beforeEach(function () {

                $scope.newActor = function () { };
                spyOn($scope, 'newActor');

                setFixtures('<tmt-diagram height="' + height + '" width="' + width + '" grid-size="' + gridSize + '" interactive="' + interactive + '" graph="graph" initialise-graph="initialiseGraph(diagram)" select="select(element)" new-actor="newActor(source, target)" />');
                elem = angular.element($('tmt-diagram')[0]);
                $compile(elem)($scope);
                $scope.$digest();
                diagram = $scope.initialiseGraph.calls.argsFor(0)[0];
                cell = new joint.shapes.basic.Rect();
                $scope.graph.addCell(cell);
                cellView = diagram.findViewByModel(cell);
                cellView.model.attributes.size.width = 160;
                cellView.model.attributes.size.height = 80;
                parent = $(elem).parent();
                parent.css('overflow', 'auto');
                parent.css('width', '400');
                parent.css('height', '250');

            });

            it('should constrain movement to x >= 0', function () {

                var moveX = -5;
                var moveY = 100;
                spyOn(cellView, 'getBBox').and.returnValue({ x: moveX, y: moveY });
                spyOn(cellView, 'pointermove');

                diagram.trigger('cell:pointermove', cellView, null, moveX, moveY);
                expect(cellView.pointermove).toHaveBeenCalled();
                expect(cellView.pointermove.calls.argsFor(0)[1]).toEqual(moveX + gridSize);

            });

            it('should constrain movement to y >= 0', function () {

                var moveX = 50;
                var moveY = -5;
                spyOn(cellView, 'getBBox').and.returnValue({ x: moveX, y: moveY });
                spyOn(cellView, 'pointermove');
    
                diagram.trigger('cell:pointermove', cellView, null, moveX, moveY);
                expect(cellView.pointermove).toHaveBeenCalled();
                expect(cellView.pointermove.calls.argsFor(0)[2]).toEqual(moveY + gridSize);
    
            });
    
            it('should scroll the diagram left', function () {
    
                var moveX = 2;
                var moveY = 50;
                parent.scrollLeft(50);
                spyOn(cellView, 'getBBox').and.returnValue({ x: moveX, y: moveY });
    
                diagram.trigger('cell:pointermove', cellView, null, moveX, moveY);
                expect(Math.round(parent.scrollLeft())).toEqual(moveX);
    
            });
    
            it('should scroll the diagram up', function () {
    
                var moveX = 50;
                var moveY = 2;
                parent.scrollTop(50);
                spyOn(cellView, 'getBBox').and.returnValue({ x: moveX, y: moveY });
    
                diagram.trigger('cell:pointermove', cellView, null, moveX, moveY);
                expect(Math.round(parent.scrollTop())).toEqual(moveY);
    
            });
    
            it('should scroll the diagram right', function () {
    
                var moveX = 300;
                var moveY = 50;
                var cellWidth = cellView.model.attributes.size.width;
                parent.scrollLeft(50);
                spyOn(cellView, 'getBBox').and.returnValue({ x: moveX, y: moveY });
                spyOn(diagram, 'setDimensions').and.callThrough();
    
                diagram.trigger('cell:pointermove', cellView, null, moveX, moveY);
                expect(Math.round(parent.scrollLeft())).toEqual(Math.round(moveX + cellWidth - parent.width()));
                expect(diagram.setDimensions).not.toHaveBeenCalled();
    
            });
    
            it('should scroll the diagram down', function () {
    
                var moveX = 50;
                var moveY = 300;
                var cellHeight = cellView.model.attributes.size.height;
                parent.scrollTop(50);
                spyOn(cellView, 'getBBox').and.returnValue({ x: moveX, y: moveY });
                spyOn(diagram, 'setDimensions').and.callThrough();
    
                diagram.trigger('cell:pointermove', cellView, null, moveX, moveY);
                expect(Math.round(parent.scrollTop())).toEqual(Math.round(moveY + cellHeight - parent.height()));
                expect(diagram.setDimensions).not.toHaveBeenCalled();
    
            });
    
            it('should expand the diagram right', function () {
    
                var moveX = 550;
                var moveY = 30;
                var cellWidth = cellView.model.attributes.size.width;
                parent.scrollLeft(50);
                spyOn(cellView, 'getBBox').and.returnValue({ x: moveX, y: moveY });
                spyOn(diagram, 'setDimensions').and.callThrough();
    
                diagram.trigger('cell:pointermove', cellView, null, moveX, moveY);
                expect(Math.round(parent.scrollLeft())).toEqual(diagram.options.width - width);
                expect(diagram.setDimensions).toHaveBeenCalled();
                expect(diagram.setDimensions.calls.argsFor(0)).toEqual([moveX + cellWidth, diagram.options.height]);
    
            });
    
            it('should expand the diagram down', function () {
    
                var moveX = 50;
                var moveY = 350;
                var cellHeight = cellView.model.attributes.size.height;
                parent.scrollTop(30);
                spyOn(cellView, 'getBBox').and.returnValue({ x: moveX, y: moveY });
                spyOn(diagram, 'setDimensions').and.callThrough();
    
                diagram.trigger('cell:pointermove', cellView, null, moveX, moveY);
                expect(Math.round(parent.scrollTop())).toEqual(diagram.options.height - height);
                expect(diagram.setDimensions).toHaveBeenCalled();
                expect(diagram.setDimensions.calls.argsFor(0)).toEqual([diagram.options.width, moveY + cellHeight]);
    
            });
        });

        describe('Boundary resize and scroll: ', function () {

            beforeEach(function () {

                $scope.newBoundary = function () { };
                spyOn($scope, 'newBoundary');

                setFixtures('<tmt-diagram height="' + height + '" width="' + width + '" grid-size="' + gridSize + '" interactive="' + interactive + '" graph="graph" initialise-graph="initialiseGraph(diagram)" select="select(element)" new-boundary="newBoundary()" />');
                elem = angular.element($('tmt-diagram')[0]);
                $compile(elem)($scope);
                $scope.$digest();
                diagram = $scope.initialiseGraph.calls.argsFor(0)[0];
                cell = new joint.shapes.basic.Rect();
                $scope.graph.addCell(cell);
                cellView = diagram.findViewByModel(cell);
                cellView.model.attributes.size.width = 10;
                cellView.model.attributes.size.height = 10;
                parent = $(elem).parent();
                parent.css('overflow', 'auto');
                parent.css('width', '400');
                parent.css('height', '250');

            });

            it('should constrain movement to x >= 0', function () {
    
                var moveX = -5;
                var moveY = 100;
                spyOn(cellView, 'pointermove');
    
                diagram.trigger('cell:pointermove', cellView, null, moveX, moveY);
                expect(cellView.pointermove).toHaveBeenCalled();
                expect(cellView.pointermove.calls.argsFor(0)[1]).toEqual(moveX + gridSize);
    
            });
    
            it('should constrain movement to y >= 0', function () {
    
                var moveX = 50;
                var moveY = -5;
                spyOn(cellView, 'pointermove');
    
                diagram.trigger('cell:pointermove', cellView, null, moveX, moveY);
                expect(cellView.pointermove).toHaveBeenCalled();
                expect(cellView.pointermove.calls.argsFor(0)[2]).toEqual(moveY + gridSize);
    
            });
    
            it('should scroll the diagram left', function () {
    
                var moveX = 2;
                var moveY = 50;
                parent.scrollLeft(50);
                spyOn(cellView, 'getBBox').and.returnValue({ x: moveX, y: moveY });
    
                diagram.trigger('cell:pointermove', cellView, null, moveX, moveY);
                expect(Math.round(parent.scrollLeft())).toEqual(moveX);
    
            });
    
            it('should scroll the diagram up', function () {
    
                var moveX = 50;
                var moveY = 2;
                parent.scrollTop(50);
                spyOn(cellView, 'getBBox').and.returnValue({ x: moveX, y: moveY });
    
                diagram.trigger('cell:pointermove', cellView, null, moveX, moveY);
                expect(Math.round(parent.scrollTop())).toEqual(moveY);
    
            });
    
            it('should scroll the diagram right', function () {
    
                var moveX = 500;
                var moveY = 50;
                var cellWidth = cellView.model.attributes.size.width;
                parent.scrollLeft(50);
                spyOn(cellView, 'getBBox').and.returnValue({ x: moveX, y: moveY });
                spyOn(diagram, 'setDimensions').and.callThrough();
    
                diagram.trigger('cell:pointermove', cellView, null, moveX, moveY);
                expect(Math.round(parent.scrollLeft())).toEqual(Math.round(moveX + cellWidth - parent.width()));
                expect(diagram.setDimensions).not.toHaveBeenCalled();
    
            });
    
            it('should scroll the diagram down', function () {
    
                var moveX = 50;
                var moveY = 300;
                var cellHeight = cellView.model.attributes.size.height;
                parent.scrollTop(50);
                spyOn(cellView, 'getBBox').and.returnValue({ x: moveX, y: moveY });
                spyOn(diagram, 'setDimensions').and.callThrough();
    
                diagram.trigger('cell:pointermove', cellView, null, moveX, moveY);
                expect(Math.round(parent.scrollTop())).toEqual(Math.round(moveY + cellHeight - parent.height()));
                expect(diagram.setDimensions).not.toHaveBeenCalled();
    
            });
    
            it('should expand the diagram right', function () {
    
                var moveX = 750;
                var moveY = 30;
                var cellWidth = cellView.model.attributes.size.width;
                parent.scrollLeft(50);
                spyOn(cellView, 'getBBox').and.returnValue({ x: moveX, y: moveY });
                spyOn(diagram, 'setDimensions').and.callThrough();
    
                diagram.trigger('cell:pointermove', cellView, null, moveX, moveY);
                expect(Math.round(parent.scrollLeft())).toEqual(diagram.options.width - width);
                expect(diagram.setDimensions).toHaveBeenCalled();
                expect(diagram.setDimensions.calls.argsFor(0)).toEqual([moveX + cellWidth, diagram.options.height]);
    
            });
    
            it('should expand the diagram down', function () {
    
                var moveX = 50;
                var moveY = 450;
                var cellHeight = cellView.model.attributes.size.height;
                parent.scrollTop(30);
                spyOn(cellView, 'getBBox').and.returnValue({ x: moveX, y: moveY });
                spyOn(diagram, 'setDimensions').and.callThrough();
    
                diagram.trigger('cell:pointermove', cellView, null, moveX, moveY);
                expect(Math.round(parent.scrollTop())).toEqual(diagram.options.height - height);
                expect(diagram.setDimensions).toHaveBeenCalled();
                expect(diagram.setDimensions.calls.argsFor(0)).toEqual([diagram.options.width, moveY + cellHeight]);
    
            });
        });
    });
});
