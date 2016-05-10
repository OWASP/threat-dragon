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
        
        //graph extensions
        
        joint.dia.Graph.prototype.initialise = function(diagramJson) {
            
            this.fromJSON(diagramJson);
            
        };
        
        joint.dia.Graph.prototype.addProcess = function()
        {
            var cell = newElement('joint.shapes.tm.Process', 50, 50, 'process ' + this.attributes.cells.length);            
            this.addCell(cell);

            return cell;
        };

        joint.dia.Graph.prototype.addStore = function()
        {
            var cell = newElement('joint.shapes.tm.Store', 50, 50, 'store ' + this.attributes.cells.length);
            this.addCell(cell);

            return cell;
        };

        joint.dia.Graph.prototype.addActor = function()
        {
            var cell = newElement('joint.shapes.tm.Actor', 50, 50, 'actor ' + this.attributes.cells.length);
            this.addCell(cell);

            return cell;
        };

        joint.dia.Graph.prototype.addFlow = function(source, target)
        {
            var cell = flow(source, target, 'flow ' + this.attributes.cells.length);
            this.addCell(cell);

            return cell;
        };

        joint.dia.Graph.prototype.addBoundary = function()
        {
            var cell = boundary();
            this.addCell(cell);

            return cell;
        };

        joint.dia.Graph.prototype.clearAll = function()
        {
            this.clear(true);
        };

        joint.dia.Graph.prototype.cellCount = function()
        {
            return this.attributes.cells.length;
        };

        joint.dia.Graph.prototype.getCellById = function(id)
        {
            return this.getCell(id);
        };
        
        //diagram extensions
        
        joint.dia.Paper.prototype.resize = function (size)
        {
            this.setDimensions(size.width, size.height);
        };
        
        joint.dia.Paper.prototype.scaleContent = function()
        {
            this.scaleContentToFit();
        };
        
        joint.dia.Paper.prototype.zoom = function(zoomLevel)
        {
            var factor = Math.pow(zoomScaleFactor, zoomLevel);
            this.scale(factor);
        };
        
        // Define the functions and properties to reveal.
        var service = {
            newGraph: newGraph
        };

        return service;

        function newGraph()
        {
            return new joint.dia.Graph();
        }

        //private

        function newElement(type, x, y, label) {
            var ShapeClass = common.utils.stringToFunction(type);
            var cell = new ShapeClass({
                position: { x: x, y: y },
                attrs: { text: { text: label } }
            });

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

            return cell;
        }
    }
})();