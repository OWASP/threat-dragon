'use strict';

var $ = require('jquery');

var stencil = function (diagramming) {

    var directive = {
        link: link,
        restrict: 'E',
        scope: {
            shape: '=',
            action: '&',
            padding: '=?',
            scale: '=?'
        }
    };

    return directive;

    function link(scope, element) {

        if (angular.isUndefined(scope.scale)) {
            scope.scale = 1.0;
        }

        if (angular.isUndefined(scope.padding)) {
            scope.padding = 0.0;
        }

        var graph = diagramming.newGraph();
        var cell = scope.shape.getElement();
        var diagram;

        if (cell.isLink()) {
            diagram = linkStencil(cell, scope.shape.label, element, scope.scale, scope.padding, graph);
        }
        else {
            diagram = elementStencil(cell, scope.shape.label, element, scope.scale, scope.padding, graph);
        }

        diagram.on('cell:pointerclick', scope.action);
        var toolTip = 'Add a new ' + scope.shape.label + ' to the model';
        cell.attr({ '.tooltip': { text: toolTip } });
        graph.addCell(cell);
    }

    function linkStencil(shape, label, element, scale, padding, graph) {

        var elementWidth = $(element).parent('div').width();
        shape.attributes.source = { x: (1.0 - scale) * elementWidth + padding, y: padding };
        shape.attributes.target = { x: scale * elementWidth - padding, y: 0.5 * scale * elementWidth - padding };
        shape.setLabel(label);

        return diagramming.newDiagram(0.5 * elementWidth + 2.0 * padding, elementWidth, 1, graph, element[0], false);
    }

    function elementStencil(shape, label, element, scale, padding, graph) {

        var elementWidth = $(element).parent('div').width();
        shape.resize(shape.get('size').width * scale, shape.get('size').height * scale);
        var shapeHeight = shape.get('size').height;
        shape.translate(0.5 * (elementWidth - shape.get('size').width), padding);
        shape.attr('text/text', label);

        return diagramming.newDiagram(shapeHeight + 2.0 * padding, elementWidth, 1, graph, element[0], false);
    }

};

var diagram = function (common, diagramming) {

    var directive = {
        link: link,
        restrict: 'E',
        scope: {
            height: '=',
            width: '=',
            gridSize: '=',
            graph: '=',
            select: '&',
            newFlow: '&',
            initialiseGraph: '&',
            interactive: '='
        }
    };

    var selected = null;
    var selectOnScope = null;
    var getLogFn = common.logger.getLogFn;
    var log = getLogFn();

    return directive;

    function link(scope, element) {

        $(element).parent().height(scope.height);
        var diagram = diagramming.newDiagram(scope.height - 10, scope.width - 10, scope.gridSize, scope.graph, element[0], scope.interactive);

        selectOnScope = scope.select;

        scope.graph.on('add', function (newCell) { newCell.translate($(element).parent().scrollLeft(), $(element).parent().scrollTop()); });

        diagram.on('cell:pointerclick', function (cellView) {
            if (!cellView.model.isLink()) {

                if (cellView._action === 'linkFrom') {

                    addLinkFrom(cellView);

                }
                else if (cellView._action === 'removeLinkFrom') {

                    removeLinkFrom(cellView);

                }
                else {

                    if (selected && !selected.model.isLink() && selected.linkFrom) {

                        scope.newFlow({ source: selected.model, target: cellView.model });
                        removeLinkFrom(selected);
                    }

                    setSelected(cellView);
                }
            }
        });

        diagram.on('blank:pointerclick', function () {

            if (selected && !selected.model.isLink()) {
                removeLinkFrom(selected);
            }

            setSelected(null);
        });

        diagram.on('link:options', function (cellView, evt) {

            if (selected && !selected.model.isLink()) {
                removeLinkFrom(selected);
            }

            setSelected(cellView);
        });

        diagram.on('cell:pointermove', function (cellView, evt, x, y) {

            var constrained = false;
            var constrainedX = x;
            var constrainedY = y;
            var cellWidth = cellView.model.attributes.size.width;
            var cellHeight = cellView.model.attributes.size.height;
            var cellX = x;
            var cellY = y;
            var bbox = cellView.getBBox();

            if (cellView.model.attributes.type != 'tm.Flow' && cellView.model.attributes.type != 'tm.Boundary') {
                //boundary box gives better scrolling for elements other than flow & boundary
                cellX = bbox.x;
                cellY = bbox.y;
            }

            //minimum x
            if (cellX <= 0) {
                constrainedX = x + scope.gridSize;
                constrained = true;
                cellX = 0;
            }

            //expand the diagram right
            if (cellX + cellWidth >= diagram.options.width) {
                diagram.setDimensions(cellX + cellWidth, diagram.options.height);
                $(element).parent().scrollLeft(diagram.options.width - scope.width);
            }

            //scroll the diagram left
            if (cellX <= $(element).parent().scrollLeft()) {
                $(element).parent().scrollLeft(cellX);
            }

            //scroll the diagram right
            if (cellX + cellWidth - $(element).parent().scrollLeft() >= $(element).parent().width() && cellX + cellWidth < diagram.options.width) {
                $(element).parent().scrollLeft(cellX + cellWidth- $(element).parent().width());
            }

            //minimum y
            if (cellY <= 0) {
                constrainedY = y + scope.gridSize;
                constrained = true;
                cellY = 0;
            }

            //expand the diagram down
            if (cellY + cellHeight >= diagram.options.height) {
                diagram.setDimensions(diagram.options.width, cellY + cellHeight);
                $(element).parent().scrollTop(diagram.options.height - scope.height);
            }

            //scroll the diagram up
            if (cellY <= $(element).parent().scrollTop()) {
                $(element).parent().scrollTop(cellY);
            }

            //scroll the diagram down
            if (cellY + cellHeight - $(element).parent().scrollTop() >= $(element).parent().height() && cellY + cellHeight < diagram.options.height) {
                $(element).parent().scrollTop(cellY + cellHeight - $(element).parent().height());
            }

            if (constrained) {
                cellView.pointermove(evt, constrainedX, constrainedY);
            }
        });

        diagram.setSelected = function (cell) {

            if (selected) {
                selected.setUnselected();
            }

            if (cell) {
                var cellView = diagram.findViewByModel(cell);

                if (cellView) {
                    cellView.setSelected();
                    selected = cellView;
                }
            }
            else {
                selected = null;
            }
        };

        scope.initialiseGraph({ diagram: diagram });
    }

    function addLinkFrom(cellView) {
        cellView.addLinkFrom();
        log('Select another model element to add a data flow');
    }

    function removeLinkFrom(cellView) {
        cellView.removeLinkFrom();
    }

    function setSelected(cellView) {
        var element = null;

        if (cellView) {
            element = cellView.model;
        }

        selectOnScope({ element: element });
    }

};

module.exports = { stencil: stencil, diagram: diagram };
