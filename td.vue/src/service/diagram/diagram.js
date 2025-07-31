import cells from './v1/cells.js';
import dataChanged from '@/service/x6/graph/data-changed.js';
import graphFactory from '@/service/x6/graph/graph.js';
import events from '@/service/x6/graph/events.js';
import store from '@/store/index.js';
import tmActions from '@/store/actions/threatmodel.js';
import { passiveSupport } from 'passive-events-support/src/utils';

const appVersion = require('../../../package.json').version;

passiveSupport({
    events: ['touchstart', 'mousewheel']
});

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
    drawV1(diagram, graph);

    const updated = graph.toJSON();
    updated.version = appVersion;
    updated.title = diagram.title;
    updated.description = diagram.description;
    updated.thumbnail = diagram.thumbnail;
    updated.id = diagram.id;
    updated.diagramType = diagram.diagramType;
    graph.getCells().forEach((cell) => dataChanged.updateStyleAttrs(cell));
    store.get().dispatch(tmActions.diagramSaved, updated);
    store.get().dispatch(tmActions.stash);
    store.get().dispatch(tmActions.notModified);

};

const drawGraph = (diagram, graph) => {
    if (diagram.version && diagram.version.startsWith('2.')) {
        console.debug('open diagram version: ' + diagram.version);
        diagram.version = appVersion;
        graph.fromJSON(diagram);
    } else {
        console.debug('upgrade version 1.x diagram');
        upgradeAndDraw(diagram, graph);
    }
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
