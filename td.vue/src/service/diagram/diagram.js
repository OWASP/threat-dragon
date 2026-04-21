import graphFactory from '@/service/x6/graph/graph.js';
import events from '@/service/x6/graph/events.js';
import { passiveSupport } from 'passive-events-support/src/utils';

const appVersion = require('../../../package.json').version;

passiveSupport({
    events: ['touchstart', 'mousewheel']
});

const drawGraph = (diagram, graph) => {
    console.debug('open diagram version: ' + diagram.version);
    diagram.version = appVersion;
    graph.fromJSON(diagram);
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
