/**
 * @name graph
 * @description Creates an x6 graph object
 */
import events from './events.js';
import factory from '../factory.js';
import keys from './keys.js';

const getReadOnlyConfig = (container) => ({
    container,
    preventDefaultContextMenu: false,
    history: {
        enabled: false
    },
    autoResize: container
});

const getEditConfig = (container) => Object.assign(getReadOnlyConfig(container), {
    history: {
        enabled: true,
        beforeAddCommand: (event, args) => {
            // Showing and hiding the tools on mouseover events
            // gets added to the history stack.  Since that is not 
            // a "user" action, we can ignore those events
            return args.key !== 'tools';
        }
    },
    grid: {
        size: 10,
        visible: true
    },
    snapline: {
        enabled: true,
        sharp: true
    },
    clipboard: {
        enabled: true
    },
    keyboard: {
        enabled: true,
        global: true
    },
    rotating: {
        enabled: true
    },
    selecting: {
        enabled: true,
        showNodeSelectionBox: false,
        showEdgeSelectionBox: true
    },
    resizing: {
        enabled: true,
        minWidth: 0,
        minHeight: 0,
        maxWidth: Number.MAX_SAFE_INTEGER,
        maxHeight: Number.MAX_SAFE_INTEGER,
        orthogonal: true,
        restricted: false,
        autoScroll: true,
        preserveAspectRatio: false,
        allowReverse: true
    },
    mousewheel: {
        enabled: true,
        global: true,
        modifiers: ['ctrl', 'meta']
    },
    panning: {
        enabled: true,
        modifiers: ['shift']
    },
    connecting: {
        allowNode: true,
        allowBlank: true
    },
    scroller: {
        enabled: true,
        autoResize: true,
        pannable: true,
        pageVisible: true,
        pageBreak: true
    }
});

const getEditGraph = (container) => {
    const graph = factory.graph(getEditConfig(container));
    events.listen(graph);
    keys.bind(graph);
    return graph;
};

const getReadonlyGraph = (container) => {
    const graph = factory.graph(getReadOnlyConfig(container));
    events.listen(graph);
    return graph;
};

export default {
    getEditGraph,
    getReadonlyGraph
};
