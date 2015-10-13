(function () {
    'use strict';

    // Factory name is handy for logging
    var serviceId = 'diagramming';

    // Define the factory on the module.
    // Inject the dependencies. 
    // Point to the factory definition function.
    angular.module('app').factory(serviceId, ['common', diagramming]);

    function diagramming(common) {

        var zoomScaleFactor = 1.25;

        // Define the functions and properties to reveal.
        var service = {
            newGraph: newGraph,
            initialise: initialise,
            resize: resize,
            scaleContent: scaleContent,
            zoom: zoom,
            newProcess: newProcess,
            newStore: newStore,
            newActor: newActor,
            newFlow: newFlow,
            newBoundary: newBoundary,
            getElements: getElements,
            getLinks: getLinks,
            clear: clear,
            cellCount: cellCount,
            getCellById: getCellById
        };

        return service;

        function newGraph()
        {
            return new joint.dia.Graph();
        }

        function initialise(graph, diagramJson)
        {
            graph.fromJSON(JSON.parse(diagramJson));
            graph.attributes.cells.models.forEach(function (cell) { addNameProperty(cell); });
        }
        
        function resize(diagram, size)
        {
            diagram.setDimensions(size.width, size.height);
        }
        
        function scaleContent(diagram)
        {
            diagram.scaleContentToFit();
        }

        function zoom(diagram, zoomLevel)
        {
            var factor = Math.pow(zoomScaleFactor, zoomLevel);
            diagram.scale(factor);
        }

        function newProcess(graph)
        {
            var cell = newElement('joint.shapes.tm.Process', 50, 50, 'process ' + graph.attributes.cells.length);
            graph.addCell(cell);

            return cell;
        }

        function newStore(graph)
        {
            var cell = newElement('joint.shapes.tm.Store', 50, 50, 'store ' + graph.attributes.cells.length);
            graph.addCell(cell);

            return cell;
        }

        function newActor(graph)
        {
            var cell = newElement('joint.shapes.tm.Actor', 50, 50, 'actor ' + graph.attributes.cells.length);
            graph.addCell(cell);

            return cell;
        }

        function newFlow(graph, source, target)
        {
            var cell = flow(source, target, 'flow ' + graph.attributes.cells.length);
            graph.addCell(cell);

            return cell;
        }

        function newBoundary(graph)
        {
            var cell = boundary();
            graph.addCell(cell);

            return cell;
        }

        function getElements(graph)
        {
            return graph.getElements();
        }

        function getLinks(graph)
        {
            return graph.getLinks();
        }

        function clear(graph)
        {
            graph.clear(true);
        }

        function cellCount(graph)
        {
            return graph.attributes.cells.length;
        }

        function getCellById(graph, id)
        {
            return graph.getCell(id);
        }

        //private

        function newElement(type, x, y, label) {
            var ShapeClass = common.utils.stringToFunction(type);
            var cell = new ShapeClass({
                position: { x: x, y: y },
                attrs: { text: { text: label } }
            });

            addNameProperty(cell);

            return cell;
        }

        function flow(source, target, label) {

            var newTarget = target ? { id: target.id } : { x: 110, y: 100 };
            var newSource = source ? { id: source.id } : { x: 30, y: 20 };

            var cell = new joint.shapes.tm.Flow({
                target: newTarget,
                source: newSource,
                vertices: []
            });

            cell.setLabel(label);

            addNameProperty(cell);

            return cell;
        }

        function boundary(source, target, label) {

            var cell = new joint.shapes.tm.Boundary({
                target: target ? target : { x: 110, y: 100 },
                source: source ? source : { x: 30, y: 20 },
                vertices: []
            });

            if (label) {
                cell.setLabel(label);
            }

            addNameProperty(cell);

            return cell;
        }

        function addNameProperty(element) {
            if (element.isLink()) {
                Object.defineProperty(element, 'name', {
                    get: function () { return wordUnwrap(this.attributes.labels[0].attrs.text.text); },
                    set: function (value) { editNameLink(this, value); }
                });
            }
            else {
                Object.defineProperty(element, 'name', {
                    get: function () { return wordUnwrap(this.attr('text/text')); },
                    set: function (value) { editNameElement(this, value); }
                });
            }
        }

        function editNameElement(element, value) {
            element.attr('text/text', wordWrap(element, value));
        }

        function editNameLink(element, value) {
            element.label(0, { attrs: { text: { text: wordWrap(element, value) } } });
        }

        function wordWrap(element, text) {

            var size = element.isLink() ? { width: 140, height: 80 } : element.get('size');
            return joint.util.breakText(text, size);
        }

        function wordUnwrap(text) {
            return text.replace('\n', ' ');
        }


    }
})();