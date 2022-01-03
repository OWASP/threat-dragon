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

const drawV1 = (diagram, graph) => {
    const { nodes, edges } = cells.map(diagram);
    const batchName = 'td-init';
    graph.startBatch(batchName);
    nodes.forEach((node) => graph.addNode(node));
    edges.forEach((edge) => graph.addEdge(edge));
    graph.stopBatch(batchName);
};

const upgradeAndDraw = (diagram, graph) => {
    if (diagram.version === '2.0') {
        graph.fromJSON(diagram);
        return;
    }

    drawV1(diagram, graph);
    const updated = graph.toJSON();
    updated.version = '2.0';
    updated.title = diagram.title;
    updated.thumbnail = diagram.thumbnail;
    updated.id = diagram.id;
    graph.getCells().forEach((cell) => dataChanged.updateStyleAttrs(cell));
    store.get().dispatch(tmActions.diagramUpdated, updated);
};

const drawGraph = (diagram, graph) => {
    upgradeAndDraw(diagram, graph);
    return graph;
};

const draw = (container, diagram) => drawGraph(diagram, graphFactory.getReadonlyGraph(container));
const edit = (container, diagram) => drawGraph(diagram, graphFactory.getEditGraph(container));

export default {
    draw,
    edit
};
