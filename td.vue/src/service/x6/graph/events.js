/**
 * @name events
 * @description Event listeners for the graph
 */
import dataChanged from './data-changed.js';
import shapes from '@/service/x6/shapes';
import store from '@/store/index.js';
import { CELL_SELECTED, CELL_UNSELECTED } from '@/store/actions/cell.js';
import { THREATMODEL_MODIFIED } from '@/store/actions/threatmodel.js';

const showPorts = (show) => {
    const container = document.getElementById('graph-container');
    const ports = container.querySelectorAll('.x6-port-body');
    for (let i = 0, len = ports.length; i < len; i += 1) {
        ports[i].style.visibility = show ? 'visible' : 'hidden';
    }
};

const canvasResized = ({ width, height }) => {
    console.debug('canvas resized to width ', width, ' height ', height);
    showPorts(false);
};

const edgeConnected = (graph) => ({ isNew, edge }) => {
    if (isNew) {
        edge.connector = 'smooth';
        replaceEdgeWithFlow(graph, edge);
    }
};

const replaceEdgeWithFlow = (graph, edge) => {
    if (edge.constructor.name !== 'Edge') {
        return;
    }

    const flow = shapes.Flow.fromEdge(edge);
    graph.addEdge(flow);
    edge.remove();
    edge = flow;
    edge.setLabels([edge.data.name]);
};

const mouseLeave = ({ cell }) => {
    if (cell.hasTools()) {
        cell.removeTools();
    }
    showPorts(false);
};

const mouseEnter = ({ cell }) => {
    const tools = ['boundary', 'button-remove'];
    // both 'node-editor' and 'edge-editor' tools seem to drop the text very easily, so do not use (yet)
    if (!cell.isNode()) {
        tools.push('vertices');
        tools.push('source-arrowhead');
        tools.push('target-arrowhead');
    }
    cell.addTools(tools);

    showPorts(true);
};

const cellAdded =
    (graph) =>
        ({ cell }) => {
            //graph.resetSelection(cell);
            console.debug('cell added with shape: ', cell.shape);

            if (cell.convertToEdge) {
                let edge = cell;
                const position = cell.position();
                const config = {
                    source: position,
                    target: {
                        x: position.x + 100,
                        y: position.y + 100
                    },
                    data: cell.getData()
                };

                if (cell.type === shapes.FlowStencil.prototype.type) {
                    edge = graph.addEdge(new shapes.Flow(config));
                } else if (cell.type === shapes.TrustBoundaryCurveStencil.prototype.type) {
                    edge = graph.addEdge(new shapes.TrustBoundaryCurve(config));
                } else {
                    console.warn('Removed unknown edge');
                }
                cell.remove();
                cell = edge;
            }

            mouseLeave({ cell });

            // boundary boxes must not overlap other diagram components
            if (cell.shape === 'trust-boundary-box') {
                cell.zIndex = -1;
            }

            store.get().dispatch(CELL_SELECTED, cell);
            dataChanged.updateProperties(cell);
            dataChanged.updateStyleAttrs(cell);
        };

const cellDeleted = () => {
    console.debug('cell deleted');
    store.get().dispatch(THREATMODEL_MODIFIED);
};

const cellSelected =
    () =>
        ({ cell }) => {
            // try and get the cell name
            if (cell.data) {
                if (cell.isNode()) {
                    cell.data.name = cell.getLabel();
                    console.debug('node selected: ' + cell.data.name);
                } else {
                    if (cell.data.name) {
                        console.debug('edge selected: ' + cell.data.name);
                    } else if (cell.getLabels) {
                        const labels = cell.getLabels();
                        if (labels.length && labels[0].attrs.label) {
                            cell.data.name = labels[0].attrs.label.text;
                            console.debug('edge selected with label: ' + cell.data.name);
                        } else {
                            console.debug('edge selected with no label');
                        }
                    } else {
                        console.debug('edge selected with no name');
                    }
                }
            } else {
                console.debug('cell selected with no name');
            }

            store.get().dispatch(CELL_SELECTED, cell);
            dataChanged.updateProperties(cell);
            dataChanged.updateStyleAttrs(cell);
            dataChanged.upgradeProperties(cell);
        };

const cellUnselected = ({ cell }) => {
    console.debug('cell unselected');
    mouseLeave({ cell });
    store.get().dispatch(CELL_UNSELECTED);
};

const cellDataChanged = ({ cell }) => {
    store.get().dispatch(CELL_SELECTED, cell);
    dataChanged.updateStyleAttrs(cell);
    store.get().dispatch(THREATMODEL_MODIFIED);
};

const listen = (graph) => {
    graph.on('resize', canvasResized);
    graph.on('edge:connected', edgeConnected(graph));
    graph.on('edge:dblclick', cellSelected);
    graph.on('edge:move', cellSelected);
    graph.on('cell:mouseleave', mouseLeave);
    graph.on('cell:mouseenter', mouseEnter);
    graph.on('cell:added', cellAdded(graph));
    graph.on('cell:removed', cellDeleted);
    graph.on('cell:change:data', cellDataChanged);
    graph.on('cell:selected', cellSelected(graph));
    graph.on('cell:unselected', cellUnselected);
    graph.on('node:move', cellSelected);
};

const removeListeners = (graph) => {
    graph.off('resize', canvasResized);
    graph.off('edge:connected', edgeConnected(graph));
    graph.off('edge:dblclick', cellSelected);
    graph.off('edge:move', cellSelected);
    graph.off('cell:mouseleave', mouseLeave);
    graph.off('cell:mouseenter', mouseEnter);
    graph.off('cell:added', cellAdded(graph));
    graph.off('cell:removed', cellDeleted);
    graph.off('cell:change:data', cellDataChanged);
    graph.off('cell:selected', cellSelected(graph));
    graph.off('cell:unselected', cellUnselected);
    graph.off('node:move', cellSelected);
};

export default {
    listen,
    removeListeners
};
