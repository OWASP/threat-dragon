'use strict';

var diagramming;
var common;
var mockLog;

describe('diagramming service:', function () {

    beforeEach(function () {

        mockLog = {};

        angular.mock.module('app');
        angular.mock.module('common');

        angular.mock.inject(function (_common_, _diagramming_) {
            common = _common_;
            diagramming = _diagramming_;
        });

    });

    describe('graph tests:', function () {

        it('should return a graph', function () {

            var graph = diagramming.newGraph();
            expect(graph).toBeDefined();
            expect(graph instanceof joint.dia.Graph).toBe(true);;

        });

        it('should deserialise a graph from json', function () {

            var graph = new joint.dia.Graph();
            var rect = new joint.shapes.basic.Rect({
                position: { x: 100, y: 100 },
                size: { width: 70, height: 30 },
                attrs: { text: { text: 'my rectangle' } }
            });

            graph.addCell(rect);
            var graphJson = graph.toJSON();
            var newGraph = new joint.dia.Graph();
            diagramming.initialise(newGraph, JSON.stringify(graphJson));

            var cell = newGraph.attributes.cells.models[0]
            expect(cell instanceof joint.shapes.basic.Rect).toBe(true);
            expect(cell.attributes.size).toEqual(rect.attributes.size);
            expect(cell.attributes.position).toEqual(rect.attributes.position);
            expect(newGraph.attributes.cells.models.length).toEqual(graph.attributes.cells.models.length);

        });

        describe('diagram tests', function () {

            var graph;
            var diagram;

            beforeEach(function () {

                setFixtures(sandbox({ id: 'diagramElement' }));
                graph = new joint.dia.Graph();
                diagram = new joint.dia.Paper({
                    el: $('#diagramElement'),
                    width: 600,
                    height: 400,
                    gridSize: 10,
                    model: graph
                });

            });

            it('should set the size of the diagram', function () {

                diagramming.resize(diagram, { height: 100, width: 200 });
                expect(diagram.options.height).toEqual(100);
                expect(diagram.options.width).toEqual(200);

            });

            it('should scale the content of the diagram', function () {

                var rect = new joint.shapes.basic.Rect({
                    position: { x: 20, y: 20 },
                    size: { width: 300, height: 200 },
                    attrs: { text: { text: 'my rectangle' } }
                });

                graph.addCell(rect);
                diagramming.scaleContent(diagram);
                var bbox = diagram.getContentBBox();
                //IE anf FF require rouding and removal of sign on zeros
                expect(Math.abs(Math.round(bbox.x, 0))).toEqual(0);
                expect(Math.abs(Math.round(bbox.y, 0))).toEqual(0);
                expect(Math.round(bbox.width/10.0, 0)).toEqual(60);
                expect(Math.round(bbox.height/10.0, 0)).toEqual(40);

            });

            it('should scale the content of the diagram', function () {

                var zoomLevel = -1;
                diagramming.zoom(diagram, zoomLevel);
                var result = $('.viewport').attr('transform') === 'scale(0.8,0.8)' || $('.viewport').attr('transform') === 'scale(0.8)'
                expect(result).toBe(true);
                zoomLevel = 1;
                diagramming.zoom(diagram, zoomLevel);
                result = $('.viewport').attr('transform') === 'scale(1.25,1.25)' || $('.viewport').attr('transform') === 'scale(1.25)'
                expect(result).toBe(true);

            });

        });

        describe('adding element tests', function () {

            var graph;

            beforeEach(function () {

                graph = new joint.dia.Graph();

            });

            it('should add a process element to the graph and return it', function () {

                var newCell = diagramming.newProcess(graph);
                expect(newCell instanceof joint.shapes.tm.Process).toBe(true);

                expect(graph.attributes.cells.models.length).toEqual(1);
                var cell = graph.attributes.cells.models[0]
                expect(cell instanceof joint.shapes.tm.Process).toBe(true);

            });

            it('should add a store element to the graph and return it', function () {

                var newCell = diagramming.newStore(graph);
                expect(newCell instanceof joint.shapes.tm.Store).toBe(true);

                expect(graph.attributes.cells.models.length).toEqual(1);
                var cell = graph.attributes.cells.models[0]
                expect(cell instanceof joint.shapes.tm.Store).toBe(true);

            });

            it('should add a actor element to the graph and return it', function () {

                var newCell = diagramming.newActor(graph);
                expect(newCell instanceof joint.shapes.tm.Actor).toBe(true);

                expect(graph.attributes.cells.models.length).toEqual(1);
                var cell = graph.attributes.cells.models[0]
                expect(cell instanceof joint.shapes.tm.Actor).toBe(true);

            });

            it('should add a boundary element to the graph and return it', function () {

                var newCell = diagramming.newBoundary(graph);
                expect(newCell instanceof joint.shapes.tm.Boundary).toBe(true);

                expect(graph.attributes.cells.models.length).toEqual(1);
                var cell = graph.attributes.cells.models[0]
                expect(cell instanceof joint.shapes.tm.Boundary).toBe(true);

            });

            it('should add a flow element to the graph and return it', function () {

                var newCell = diagramming.newFlow(graph);
                expect(newCell instanceof joint.shapes.tm.Flow).toBe(true);

                expect(graph.attributes.cells.models.length).toEqual(1);
                var cell = graph.attributes.cells.models[0]
                expect(cell instanceof joint.shapes.tm.Flow).toBe(true);

            });

            it('should add a flow element to the graph with specified source/target and return it', function () {

                var process = diagramming.newProcess(graph);
                var actor = diagramming.newActor(graph);
                var flow = diagramming.newFlow(graph, actor, process);

                expect(flow instanceof joint.shapes.tm.Flow).toBe(true);
                expect(flow.attributes.source.id).toEqual(actor.id);
                expect(flow.attributes.target.id).toEqual(process.id);

            });

        });

        describe('multi element tests', function () {

            var graph;
            var process;
            var store;
            var actor;
            var flow1;
            var flow2;
            var boundary;

            beforeEach(function () {

                graph = new joint.dia.Graph();
                process = diagramming.newProcess(graph);
                store = diagramming.newStore(graph);
                actor = diagramming.newActor(graph);
                flow1 = diagramming.newFlow(graph, actor, process);
                flow2 = diagramming.newFlow(graph, store, process);
                boundary = diagramming.newBoundary(graph);

            });

            it('should return the elements in the graph', function () {

                var elements = diagramming.getElements(graph);

                expect(elements.length).toEqual(3);
                expect(elements[0] instanceof joint.shapes.tm.Process).toBe(true);
                expect(elements[1] instanceof joint.shapes.tm.Store).toBe(true);
                expect(elements[2] instanceof joint.shapes.tm.Actor).toBe(true);

            });

            it('should return the links in the graph', function () {

                var links = diagramming.getLinks(graph);

                expect(links.length).toEqual(3);
                expect(links[0] instanceof joint.shapes.tm.Flow).toBe(true);
                expect(links[1] instanceof joint.shapes.tm.Flow).toBe(true);
                expect(links[2] instanceof joint.shapes.tm.Boundary).toBe(true);

            });
            
            it('should return all the elements and links in the graph', function() {
                
                var cells = diagramming.getCells(graph);
                
                expect(cells.length).toEqual(6);
                expect(cells[0] instanceof joint.shapes.tm.Process).toBe(true);
                expect(cells[1] instanceof joint.shapes.tm.Store).toBe(true);
                expect(cells[2] instanceof joint.shapes.tm.Actor).toBe(true);
                expect(cells[3] instanceof joint.shapes.tm.Flow).toBe(true);
                expect(cells[4] instanceof joint.shapes.tm.Flow).toBe(true);
                expect(cells[5] instanceof joint.shapes.tm.Boundary).toBe(true);                
                
            });

            it('should delete all the elements in the graph', function () {

                diagramming.clear(graph);
                var links = diagramming.getLinks(graph);
                var elements = diagramming.getElements(graph);

                expect(links.length).toEqual(0);
                expect(elements.length).toEqual(0);

            });

            it('should count the elements in the graph', function () {

                expect(diagramming.cellCount(graph)).toEqual(6);

            });

            it('should get the specifed element', function () {

                expect(diagramming.getCellById(graph, actor.id)).toEqual(actor);

            });

        });

        describe('label editing tests', function () {

            var graph;
            var process;
            var flow;

            beforeEach(function () {

                graph = new joint.dia.Graph();
                process = diagramming.newProcess(graph);
                flow = diagramming.newFlow(graph);

            });

            it('should get the label for an element', function () {

                expect(process.name).toEqual('process 0');

            });

            it('should get the label for an link', function () {

                expect(flow.name).toEqual('flow 1');

            });

            //purely to push coverage up
            it('should set the label for an element', function () {

                process.name = 'new name'
                expect(process.name).toEqual('new name');

            });

            //purely to push coverage up
            it('should set the label for an link', function () {

                flow.name = 'new name';
                expect(flow.name).toEqual('new name');

            });

        });

    });

});