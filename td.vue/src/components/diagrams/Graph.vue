<template>
  <div>
    <b-row>
      <b-col>
        <p>
          Keyboard shortcuts: <b-badge>ctrl+c</b-badge> copy |
          <b-badge>ctrl+v</b-badge> paste | <b-badge>ctrl+z</b-badge> undo |
          <b-badge>ctrl+y</b-badge> redo | <b-badge>del</b-badge> delete |
          <b-badge>shift+left-click</b-badge> pan(drag) |
          <b-badge>click/drag</b-badge> on empty space for multi-select selected
          | <b-badge>ctrl+mousewheel</b-badge> zoom
        </p>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="2">
        <div ref="stencil_container"></div>
      </b-col>
      <b-col md="8">
        <b-row>
          <b-col>
            <b-btn-group>
              <td-form-button
                :isPrimary="true"
                :onBtnClick="noOp"
                icon="save"
                text="Save"
              />
              <td-form-button :onBtnClick="noOp" icon="times" text="Cancel" />
              <td-form-button :onBtnClick="undo" icon="undo" text="" />
              <td-form-button :onBtnClick="redo" icon="redo" text="" />
              <td-form-button :onBtnClick="zoomIn" icon="search-plus" text="" />
              <td-form-button
                :onBtnClick="zoomOut"
                icon="search-minus"
                text=""
              />
              <td-form-button
                :onBtnClick="deleteSelected"
                icon="trash"
                text=""
              />
              <td-form-button :onBtnClick="togggleGrid" icon="th" text="" />
            </b-btn-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <div
              id="graph-container"
              ref="container"
              style="min-height: 600px"
            ></div>
          </b-col>
        </b-row>
      </b-col>
      <b-col md="2">
        <b-card header="Actions"> </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { Graph } from '@antv/x6';

import { LegacyTrustBoundary } from '@/service/x6/shapes/legacy-trust-boundary.js';
import shapes from '@/service/x6/shapes/shapes.js';
import stencil from '@/service/x6/stencil.js';
import TdFormButton from '@/components/FormButton.vue';
import { TrustBoundary } from '@/service/x6/shapes/trust-boundary.js';
/*
  TODOS:
    - "Link from here" - auto-linking of elements (needed or not?)
    - Export JSON
    - Export images
    - Fix CSP
    - Change color if threat associated
    - Change to dotted if out of scope
    - Add ability to change labels and such
    - Save / Cancel buttons are currently no-ops
    - Migrate graph to its own constructor function
    - Start writing unit tests once satisfied with the architecture
*/

const data = {
    nodes: [
        {
            id: 'node1',
            x: 40,
            y: 40,
            width: 80,
            height: 40,
            label: 'hello',
            attrs: {
                body: {
                    magnet: true
                }
            }
        },
        {
            id: 'node2',
            x: 40,
            y: 180,
            width: 80,
            height: 40,
            label: 'world',
            attrs: {
                body: {
                    magnet: true
                }
            }
        },
        {
            id: 'node3',
            x: 220,
            y: 65,
            width: 80,
            height: 40,
            label: 'test',
            attrs: {
                body: {
                    magnet: true
                }
            }
        },
    ],
    edges: [
        {
            source: 'node1',
            target: 'node2',
            connector: 'rounded',
        },
        {
            source: 'node1',
            target: 'node3',
            connector: 'rounded',
        },
        {
            source: 'node3',
            target: 'node1',
            connector: 'rounded',
        },
    ],
};

export default {
    name: 'TdGraph',
    components: {
        TdFormButton,
    },
    data() {
        return {
            graph: null,
            gridShowing: true,
        };
    },
    mounted() {
        this.init();
    },
    loaded() {
        shapes.register();
    },
    methods: {
        noOp() {
            // TODO: Just for testing
        },
        redo() {
            if (this.graph.canRedo()) {
                this.graph.redo();
            }
        },
        undo() {
            if (this.graph.canUndo()) {
                this.graph.undo();
            }
        },
        zoomOut() {
            this.graph.zoom(-0.2);
        },
        zoomIn() {
            this.graph.zoom(0.2);
        },
        deleteSelected() {
            this.graph.removeCells(this.graph.getSelectedCells());
        },
        togggleGrid() {
            if (this.gridShowing) {
                this.graph.hideGrid();
                this.gridShowing = false;
            } else {
                this.graph.showGrid();
                this.gridShowing = true;
            }
        },
        init() {
            // TODO: Move to its own declaration
            const graph = new Graph({
                container: this.$refs.container,
                preventDefaultContextMenu: false,
                history: {
                    enabled: true,
                    beforeAddCommand: (event, args) => {
                        return args.key != 'tools';
                    },
                },
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
                rotating: {
                    enabled: true,
                },
                selecting: {
                    enabled: true,
                    rubberband: true,
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
                mousewheel: {
                    enabled: true,
                    global: true,
                    modifiers: ['ctrl', 'meta'],
                },
                panning: {
                    enabled: true,
                    modifiers: ['shift'],
                },
                connecting: {
                    allowNode: true,
                    allowBlank: true,
                },
                interacting: {
                    edgeMovable: true,
                    arrowheadMovable: true
                }
            });
            this.graph = graph;

            const ltb = new LegacyTrustBoundary({
                x: 20,
                y: 50,
                width: 200,
                height: 20,
                label: 'foo-the-bar'
            });
            graph.addNode(ltb);

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
                    cell.addTools(['vertices', 'button-remove', 'boundary']);
                }
            });

            stencil.get(graph, this.$refs.stencil_container);

            // We need to add the router and connector data when a new edge is added.
            // https://x6.antv.vision/en/docs/tutorial/intermediate/events
            // If we do not, it is just a straight line with no collision detection
            graph.on('edge:connected', ({ isNew, edge }) => {
                if (isNew) {
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

                // TODO: The edge implementation is a terrible solution, as x6 is not allowing
                // the user to easily move the start/end point.
                // Maybe the solution will be creating an edge from an existing
                // trust boundary and not allowing new ones to be created of the same time.
                // All new trust boundaries will have to use the new Trust Boundary?
                // Just adding a legacy trust boundary will NOT work for v1 models, as the
                // legacy trust boundary cannot have verticies added to it
                if (cell.constructor.name === 'LegacyTrustBoundary') {
                    cell.label = '';
                    // const position = cell.getProp('position');
                    // graph.addEdge({
                    //     source: { x: position.x, y: position.y },
                    //     target: { x: position.x + 150, y: position.y },
                    //     attrs: {
                    //         line: {
                    //             stroke: 'green',
                    //             strokeWidth: 2,
                    //             strokeDasharray: '5 5'
                    //         }
                    //     },
                    //     connector: 'smooth',
                    //     arrowheadMovable: true
                    // });
                    // graph.removeCell(cell);
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