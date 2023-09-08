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
        pointerEvents: 'auto',
        rubberband: true,
        rubberNode: true,
        rubberEdge: true,
        multiple: true,
        movable: true,
        strict: true, // need strict select otherwise data flows select other elements
        useCellGeometry: false, // disabled, otherwise multi-select does weird stuff
        showNodeSelectionBox: false,
        showEdgeSelectionBox: false,
        selectNodeOnMoved: false,
        selectEdgeOnMoved: false,
        selectCellOnMoved: false,
        content: null,
        handles: null
    },
    resizing: {
        enabled: true,
        minWidth: 50,
        minHeight: 50,
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
        enabled: true, // provides panning using shift key, as we have to disable scroller.pannable below
        modifiers: ['shift']
    },
    connecting: {
        allowNode: true,
        allowBlank: true
    },
    scroller: {
        enabled: true,
        autoResize: true,
        pannable: false, // disable because it interferes with rubberbanding, see panning above
        pageVisible: true,
        pageBreak: false
    },
    // container: container,  // still not able to auto-size, see https://x6.antv.vision/en/docs/api/graph/graph#autoresize
    //autoResize: true        // note that this is inherited from getReadOnlyConfig
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
