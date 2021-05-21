<template>
  <div>
    <b-row>
      <b-col>
        <p>Keyboard shortcuts: <b-badge>ctrl+c</b-badge> copy | <b-badge>ctrl+v</b-badge> paste | <b-badge>ctrl+z</b-badge> undo | <b-badge>ctrl+y</b-badge> redo</p>
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
import { Addon, Graph, Shape } from '@antv/x6';

/*
  TODOS:
    - "Link from here" - auto-linking of elements
    - Add context menus
    - Export JSON
    - Add buttons for things like copy, paste, save, undo/redo, etc
    - Export images
    - Set up custom shapes just for threat dragon/modeling
*/

// Custom Shapes, attrs.body uses standard SVG attributes in camelCase
// https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute
Graph.registerNode('custom-rect', {
    inherit: 'rect',
    width: 300,
    height: 40,
    attrs: {
        body: {
            rx: 10,
            ry: 10,
            strokeWidth: 1,
            strokeDasharray: '5 5',
            stroke: '#5755a1',
        },
        label: {
            fill: '#333',
            fontSize: 18,
            refX: 10,
            textAnchor: 'left'
        }
    },
});

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
                width: '100%',
                height: '100%',
                history: {
                    enabled: true,
                },
                grid: {
                    size: 10,
                    visible: true,
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
                selecting: {
                    enabled: true,
                    showNodeSelectionBox: true
                }
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

            graph.fromJSON(data);

            graph.centerContent();

            graph.addNode({
                x: 0,
                y: -5,
                shape: 'custom-rect',
                label: 'My Custom Rect'
            });

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

            const stencil = new Addon.Stencil({
                title: 'MyStencil',
                target: graph,
                // These properties seem to be required for the stencil to display anything
                // They cannot accept relative values, and the scrollbar is not enabled
                // by default... After searching it seems to work?
                stencilGraphWidth: 400,
                // stencilGraphHeight: 600,
                groups: [
                    {
                        name: 'test1',
                        title: 'Test 1',
                        collapsed: true,
                        collapsable: true,
                        graphHeight: '250',
                    },
                    {
                        name: 'test2',
                        title: 'Test 2',
                        collapsed: false,
                        collapsable: true,
                    },
                ],
                layoutOptions: {
                    columns: 1,
                    center: true,
                    resizeToFit: true,
                },
                search: (cell, keyword) => {
                    if (cell.label && typeof cell.label !== 'undefined') {
                        if (
                            cell.label.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
                        ) {
                            return true;
                        }
                    }
                    return cell.shape.indexOf(keyword.toLowerCase()) !== -1;
                },
                placeholder: 'Search for components',
                notFoundText: "We don't have that yet, want to open an issue? :)",
            });

            const ropts = {
                width: 70,
                height: 40,
            };

            const copts = {
                width: 50,
                height: 50,
            };
            const r1 = new Shape.Rect({
                width: 70,
                height: 40,
                label: 'TEST',
            });
            const c1 = new Shape.Circle(copts);
            const r2 = new Shape.Rect(ropts);
            const c2 = new Shape.Circle(copts);
            const r3 = new Shape.Rect(ropts);
            const c3 = new Shape.Circle(copts);
            stencil.load([r1, c1, c2, r2.clone()], 'test1');
            stencil.load([c2.clone(), r2, r3, c3], 'test2');
            this.$refs.stencil_container.appendChild(stencil.container);

            // Searching forces a redraw of the stencil, which will ensure that all items in
            // the group are shown.  The boundaries are automatically calculated.
            // I could not find a way of doing that using the constructor options,
            // so this is a hack to force it to happen.
            stencil.onSearch({ target: { value: ' ' } });
            stencil.onSearch({ target: { value: '' } });

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
                console.log('MOUSE LEAVE');
                if (cell.hasTools()) {
                    console.log('cell has tools...');
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