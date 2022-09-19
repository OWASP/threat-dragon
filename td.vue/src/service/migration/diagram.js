/**
 * @name diagram
 * @description Reads an existing v1 diagram to create components for the v2 UI
 * This is not for persistence, and is done on a diagram by diagram basis
 */

import cells from './cells.js';
import dataChanged from '../x6/graph/data-changed.js';
import graphFactory from '../x6/graph/graph.js';
import store from '../../store/index.js';
import tmActions from '../../store/actions/threatmodel.js';
import events from '../x6/graph/events.js';

const buildVersion = require('../../../package.json').version;

const drawV1 = (diagram, graph) => {
    const { nodes, edges } = cells.map(diagram);
    const batchName = 'td-init';
    graph.startBatch(batchName);
    nodes.forEach((node) => graph.addNode(node));
    edges.forEach((edge) => graph.addEdge(edge));
    graph.stopBatch(batchName);
};

// update a version 1.x threat model (and diagrams) to version 2.x
const upgradeAndDraw = (diagram, graph) => {

    // check if diagram is already at version 2.x
    if (diagram.version != null && diagram.version.startsWith('2.')) {
        graph.fromJSON(diagram);
        return;
    }

    drawV1(diagram, graph);
    const updated = graph.toJSON();
    updated.version = buildVersion;
    updated.title = diagram.title;
    updated.thumbnail = diagram.thumbnail;
    updated.id = diagram.id;
    updated.diagramType = diagram.diagramType;
    graph.getCells().forEach((cell) => dataChanged.updateStyleAttrs(cell));
    store.get().dispatch(tmActions.diagramUpdated, updated);
    store.get().dispatch(tmActions.setImmutableCopy);
};

const drawGraph = (diagram, graph) => {
    upgradeAndDraw(diagram, graph);
    return graph;
};

const draw = (container, diagram) => drawGraph(diagram, graphFactory.getReadonlyGraph(container));
const edit = (container, diagram) => drawGraph(diagram, graphFactory.getEditGraph(container));

const dispose = (graph) => {
    events.removeListeners(graph);
    graph.dispose();
};

export default {
    dispose,
    draw,
    edit
};
