import { Graph } from '@antv/x6';
import { Clipboard } from '@antv/x6-plugin-clipboard';
import { History } from '@antv/x6-plugin-history';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { Scroller } from '@antv/x6-plugin-scroller';
import { Selection } from '@antv/x6-plugin-selection';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Transform } from '@antv/x6-plugin-transform';
import events from './events.js';
import keys from './keys.js';

const getEditGraph = (container, ctor = Graph) => {
    const graph = new ctor({
        container: container,
        autoResize: container,
        connecting: {
            allowNode: true,
            allowBlank: true
        },
        grid: {
            size: 10,
            visible: true
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
        preventDefaultContextMenu: false
    });
    graph
        .use(new Clipboard())
        .use(
            new History({
                enabled: true,
                beforeAddCommand: beforeAddCommand
            })
        )
        .use(
            new Keyboard({
                enabled: true,
                global: true
            })
        )
        .use(
            new Scroller({
                enabled: true,
                autoResize: true,
                pannable: false, // disable because it interferes with rubberbanding, see panning above
                pageVisible: true,
                pageBreak: false
            })
        )
        .use(
            new Selection({
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
            })
        )
        .use(
            new Snapline({
                enabled: true,
                sharp: true
            })
        )
        .use(
            new Transform({
                resizing: {
                    enabled: true,
                    minWidth: 50,
                    minHeight: 50,
                    maxWidth: Number.MAX_SAFE_INTEGER,
                    maxHeight: Number.MAX_SAFE_INTEGER,
                    orthogonal: true,
                    restricted: false,
                    autoScroll: true,
                    preserveAspectRatio: true,
                    allowReverse: true
                },
                rotating: true
            })
        );

    events.listen(graph);
    keys.bind(graph);
    return graph;
};

const getReadonlyGraph = (container, ctor = Graph) => {
    const graph = new ctor({
        container: container,
        autoResize: container,
        preventDefaultContextMenu: false
    });
    graph
        .use(
            new History({
                enabled: false,
            })
        );

    events.listen(graph);
    return graph;
};

export const beforeAddCommand = (_event, args) => {
    // Showing and hiding the tools on mouseover events
    // gets added to the history stack.
    // Ignore those events since that is not a "user" action
    return args.key !== 'tools';
};

export default {
    getEditGraph,
    getReadonlyGraph
};
