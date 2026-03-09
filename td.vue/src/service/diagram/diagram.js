import cells from './v1/cells.js';
import dataChanged from '@/service/x6/graph/data-changed.js';
import graphFactory from '@/service/x6/graph/graph.js';
import events from '@/service/x6/graph/events.js';
import store from '@/store/index.js';
import tmActions from '@/store/actions/threatmodel.js';
import { passiveSupport } from 'passive-events-support/src/utils';
import {
    getElementsInsideBoundary,
    getBoundariesCrossedByFlow,
    getFlowsCrossedByBoundary
} from '../boundary-utils.js';

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

    // Update any style attributes on cells first
    graph.getCells().forEach((cell) => dataChanged.updateStyleAttrs(cell));

    // before serializing the graph to JSON, inject boundary/flow relationship data
    graph.getCells().forEach(boundary => {
        if (boundary.shape === 'trust-boundary-box' ||
            boundary.shape === 'trust-boundary-curve') {

            // Find elements inside this boundary
            const contained = getElementsInsideBoundary(graph.getCells(), boundary);

            // Store the list inside the cell's data so it will be present in toJSON()
            boundary.data = boundary.data || {};
            boundary.data.containedElements = contained.map(el => el.id);
            boundary.data.crossingFlows = getFlowsCrossedByBoundary(boundary, graph.getCells());
        }
    });

    // For flows, attach any crossed boundary ids to the flow cell's data
    graph.getCells().forEach(flow => {
        if (flow.shape === 'flow') {
            flow.data = flow.data || {};
            flow.data.trustBoundaryIds = getBoundariesCrossedByFlow(flow, graph.getCells());
        }
    });

    // Now serialize the graph (after injecting the new data)
    const updated = graph.toJSON();
    updated.version = appVersion;
    updated.title = diagram.title;
    updated.description = diagram.description;
    updated.thumbnail = diagram.thumbnail;
    updated.id = diagram.id;
    updated.diagramType = diagram.diagramType;

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
