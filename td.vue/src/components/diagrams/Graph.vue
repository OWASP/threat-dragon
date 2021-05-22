<template>
  <div>
    <b-row>
      <b-col>
        <p>
          Keyboard shortcuts: <b-badge>ctrl+c</b-badge> copy |
          <b-badge>ctrl+v</b-badge> paste | <b-badge>ctrl+z</b-badge> undo |
          <b-badge>ctrl+y</b-badge> redo | <b-badge>del</b-badge> delete
          selected
        </p>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="2">
        <div ref="stencil_container"></div>
      </b-col>
      <b-col>
        <div
          id="graph-container"
          ref="container"
          style="min-height: 600px"
        ></div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { Graph } from '@antv/x6';

import shapes from '@/service/x6/shapes/shapes.js';
import stencil from '@/service/x6/stencil.js';
import { TrustBoundary } from '@/service/x6/shapes/trust-boundary.js';
/*
  TODOS:
    - "Link from here" - auto-linking of elements
    - Add context menus
    - Export JSON
    - Add buttons for things like copy, paste, save, undo/redo, etc
    - Export images
    - Fix CSP

    From Jon:
      - pan and zoom
      - diagram resizing
      - arrows not bunched into a single arrow
      - (done) rectangle boundaries for trust boundaries
      - block selection (move, copy, delete)
*/

shapes.register();

const ports = {
    groups: {
        top: {
            position: 'top',
            attrs: {
                circle: {
                    r: 6,
                    magnet: true,
                    stroke: '#31d0c6',
                    strokeWidth: 2,
                    fill: '#fff',
                },
            },
        },
        bottom: {
            position: 'bottom',
            attrs: {
                circle: {
                    r: 6,
                    magnet: true,
                    stroke: '#31d0c6',
                    strokeWidth: 2,
                    fill: '#fff',
                },
            },
        },
        left: {
            position: 'left',
            attrs: {
                circle: {
                    r: 6,
                    magnet: true,
                    stroke: '#31d0c6',
                    strokeWidth: 2,
                    fill: '#fff',
                },
            },
        },
        right: {
            position: 'right',
            attrs: {
                circle: {
                    r: 6,
                    magnet: true,
                    stroke: '#31d0c6',
                    strokeWidth: 2,
                    fill: '#fff',
                },
            },
        },
    },
    items: [
        {
            id: 'portTop',
            group: 'top',
        },
        {
            id: 'portBottom',
            group: 'bottom',
        },
        {
            id: 'portLeft',
            group: 'left',
        },
        {
            id: 'portRight',
            group: 'right',
        },
    ],
};

const data = {
    nodes: [
        {
            id: 'node1',
            x: 40,
            y: 40,
            width: 80,
            height: 40,
            label: 'hello',
            ports,
        },
        {
            id: 'node2',
            x: 40,
            y: 180,
            width: 80,
            height: 40,
            label: 'world',
            ports,
        },
        {
            id: 'node3',
            x: 220,
            y: 65,
            width: 80,
            height: 40,
            label: 'test',
            ports,
        },
    ],
    edges: [
        {
            source: 'node1',
            target: 'node2',
            router: 'manhattan',
            connector: 'rounded',
        },
        {
            source: 'node1',
            target: 'node3',
            router: 'manhattan',
            connector: 'rounded',
        },
        {
            source: 'node3',
            target: 'node1',
            router: 'manhattan',
            connector: 'rounded',
        },
    ],
};

export default {
    name: 'TdGraph',
    mounted() {
        this.init();
    },
    methods: {
        init() {
            // https://x6.antv.vision/en/docs/tutorial/basic/dnd
            const graph = new Graph({
                container: this.$refs.container,
                // width: "100%",
                // height: "100%",
                // height: '600px',
                allowPanning: true,
                history: {
                    enabled: true,
                },
                // scroller: {
                //   enabled: true,
                // },
                grid: {
                    size: 10,
                    visible: true,
                },
                snapline: {
                    enabled: true,
                    sharp: true,
                },
                clipboard: {
                    enabled: true,
                },
                keyboard: {
                    enabled: true,
                    global: true,
                },
                selecting: {
                    enabled: true,
                    showNodeSelectionBox: false,
                    showEdgeSelectionBox: true,
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
                    allowReverse: true,
                },
            });

            graph.bindKey('ctrl+c', () => {
                const cells = graph.getSelectedCells();
                if (cells.length) {
                    graph.copy(cells);
                }
                return false;
            });

            graph.bindKey('ctrl+v', () => {
                if (graph.isClipboardEmpty()) {
                    return false;
                }

                const cells = graph.paste({ offset: 32 });
                graph.cleanSelection();
                graph.select(cells);
            });

            graph.bindKey('ctrl+z', () => {
                if (graph.canUndo()) {
                    graph.undo();
                }
            });

            graph.bindKey('ctrl+y', () => {
                if (graph.canRedo()) {
                    graph.redo();
                }
            });

            graph.bindKey('del', () => {
                graph.removeCells(graph.getSelectedCells());
            });

            graph.fromJSON(data);

            graph.centerContent();

            graph.addNode(
                new TrustBoundary({
                    x: 10,
                    y: -20,
                })
            );
            graph.on('cell:mouseenter', ({ cell }) => {
                if (cell.isNode()) {
                    cell.addTools([
                        {
                            name: 'boundary',
                            args: {
                                attrs: {
                                    fill: '#7c68fc',
                                    stroke: '#333',
                                    'stroke-width': 1,
                                    'fill-opacity': 0.2,
                                },
                            },
                        },
                        {
                            name: 'button-remove',
                            args: {
                                x: 0,
                                y: 0,
                                offset: { x: 10, y: 10 },
                            },
                        },
                    ]);
                } else {
                    cell.addTools(['vertices', 'segments']);
                }
            });




            stencil.get(graph, this.$refs.stencil_container);



            // We need to add the router and connector data when a new edge is added.
            // https://x6.antv.vision/en/docs/tutorial/intermediate/events
            // If we do not, it is just a straight line with no collision detection
            graph.on('edge:connected', ({ isNew, edge }) => {
                if (isNew) {
                    edge.router = 'manhattan';
                    edge.connector = 'rounded';
                }
            });

            graph.on('cell:mouseleave', ({ cell }) => {
                if (cell.hasTools()) {
                    cell.removeTools();
                }
            });

            graph.on('cell:changed:position', ({ cell }) => {
                if (cell.hasTools()) {
                    cell.removeTools();
                }
            });

            graph.on('cell:added', ({ cell }) => {
                if (cell.hasTools()) {
                    cell.removeTools();
                }

                // TODO: needs to be strongly typed,
                // we probably should have canvas size defaults for
                // all of our custom shapes as well.
                if (cell.constructor.name === 'TrustBoundary') {
                    cell.resize(500, 600);
                }
            });

            graph.on('cell:unselected', ({ cell }) => {
                if (cell.hasTools()) {
                    cell.removeTools();
                }
            });
        },
    },
};
</script>