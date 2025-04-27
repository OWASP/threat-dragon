// dataChanged is not used here
import graphFactory from '@/service/x6/graph/graph.js';
import events from '@/service/x6/graph/events.js';
import store from '@/store/index.js';
import tmActions from '@/store/actions/threatmodel.js';
import { passiveSupport } from 'passive-events-support/src/utils';
import logger from '@/utils/logger.js';

// Create a context-specific logger
const log = logger.getLogger('service:migration:diagram');

const appVersion = require('../../../package.json').version;

passiveSupport({
    events: ['touchstart', 'mousewheel']
});

const drawGraph = (diagram, graph) => {
    if (!diagram) {
        log.error('Cannot draw null or undefined diagram');
        return graph;
    }

    log.debug('Drawing diagram', { title: diagram.title, cellCount: diagram.cells ? diagram.cells.length : 0 });

    try {
        if (diagram.version && diagram.version.startsWith('2.')) {
            log.debug('Opening diagram', { version: diagram.version });
            diagram.version = appVersion;

            // Ensure cells is an array
            if (!diagram.cells || !Array.isArray(diagram.cells)) {
                log.warn('Diagram cells missing or not an array, initializing empty cells array');
                diagram.cells = [];
            }

            // Load the diagram JSON into the graph
            graph.fromJSON(diagram);
        } else {
            log.debug('Upgrading version 1.x diagram');
            // For older versions, we'll just create empty cells
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
        }
    } catch (error) {
        log.error('Error drawing diagram', { error });
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