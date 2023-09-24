/**
 * @name events
 * @description Event listeners for the graph
 */
import dataChanged from './data-changed.js';
import defaultProperties from '@/service/entity/default-properties.js';
import store from '@/store/index.js';
import { CELL_SELECTED, CELL_UNSELECTED } from '@/store/actions/cell.js';
import shapes from '@/service/x6/shapes/index.js';

const edgeConnected = ({ isNew, edge }) => {
    if (isNew) {
        edge.connector = 'smooth';
    }
};

const removeCellTools = ({ cell }) => {
    if (cell.hasTools()) {
        cell.removeTools();
    }
};

const mouseEnter = ({ cell }) => {
    const tools = ['boundary', 'button-remove'];
    if (!cell.isNode()) {
        tools.push('vertices');
        tools.push('source-arrowhead');
        tools.push('target-arrowhead');
    }
    cell.addTools(tools);
};

const cellAdded = (graph) => ({ cell }) => {
    if (cell.convertToEdge) {
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
            graph.addEdge(new shapes.Flow(config));
        }
        if (cell.type === shapes.TrustBoundaryCurveStencil.prototype.type) {
            graph.addEdge(new shapes.TrustBoundaryCurve(config));
        }

        cell.remove();
    }

    removeCellTools({ cell });
    // boundary boxes must not overlap other diagram components
    if (cell.shape === 'trust-boundary-box') {
        cell.zIndex = -1;
    }

    dataChanged.updateStyleAttrs(cell);
    if (!cell.data) {
        if (cell.isEdge()) {
            cell.type = defaultProperties.flow.type;
        }
        cell.setData(defaultProperties.getByType(cell.type));
    }
};

const cellSelected = ({ cell }) => {
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
    dataChanged.updateStyleAttrs(cell);
};

const cellUnselected = ({ cell }) => {
    removeCellTools({ cell });

    if (cell.setName && cell.getData) {
        cell.setName(cell.getData().name);
    } else {
        console.log('Cannot set name');
    }

    store.get().dispatch(CELL_UNSELECTED);
    dataChanged.updateStyleAttrs(cell);
};

const cellDataChanged = ({ cell }) => {
    dataChanged.updateStyleAttrs(cell);
};

const nodeAddFlow = (graph) => ({ node }) => {
    if (!node.data.isTrustBoundary && node.data.type !== 'tm.Text') {
        const position = node.position();
        const config = {
            source: {
                cell: node.id
            },
            target: {
                x: position.x + 50,
                y: position.y - 100
            }
        };
        console.debug('add data flow to node id:' + node.id);
        graph.addEdge(new shapes.Flow(config));
    }
};

const listen = (graph) => {
    graph.on('edge:connected', edgeConnected);
    graph.on('edge:dblclick', cellSelected);
    graph.on('edge:move', cellSelected);
    graph.on('cell:mouseleave', removeCellTools);
    graph.on('cell:mouseenter', mouseEnter);
    graph.on('cell:added', cellAdded(graph));
    graph.on('cell:change:data', cellDataChanged);
    graph.on('cell:selected', cellSelected);
    graph.on('cell:unselected', cellUnselected);
    graph.on('node:dblclick', nodeAddFlow(graph));
    graph.on('node:move', cellSelected);
};

const removeListeners = (graph) => {
    graph.off('edge:connected', edgeConnected);
    graph.off('edge:dblclick', cellSelected);
    graph.off('edge:move', cellSelected);
    graph.off('cell:mouseleave', removeCellTools);
    graph.off('cell:mouseenter', mouseEnter);
    graph.off('cell:added', cellAdded(graph));
    graph.off('cell:change:data', cellDataChanged);
    graph.off('cell:selected', cellSelected);
    graph.off('cell:unselected', cellUnselected);
    graph.off('node:dblclick', nodeAddFlow(graph));
    graph.off('node:move', cellSelected);
};

export default {
    listen,
    removeListeners
};
