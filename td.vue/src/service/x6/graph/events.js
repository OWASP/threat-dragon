/**
 * @name events
 * @description Event listeners for the graph
 */
import { CELL_SELECTED, CELL_UNSELECTED } from '../../../store/actions/cell.js';
import dataChanged from './data-changed.js';
import defaultProperties from '../../entity/default-properties.js';
import shapes from '../shapes/index.js';
import store from '../../../store/index.js';
import { FlowStencil } from '../shapes/flow-stencil.js';
import { TrustBoundaryCurveStencil } from '../shapes/trust-boundary-curve-stencil.js';

// We need to add the router and connector data when a new edge is added.
// https://x6.antv.vision/en/docs/tutorial/intermediate/events
// If we do not, it is just a straight line with no collision detection
// This may be what we want in some cases
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
    const tools = [ 'boundary', 'button-remove' ];
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

        if (cell.type === FlowStencil.prototype.type) {
            graph.addEdge(new shapes.Flow(config));
        }
        if (cell.type === TrustBoundaryCurveStencil.prototype.type) {
            graph.addEdge(new shapes.TrustBoundaryCurve(config));
        }

        cell.remove();
    }

    removeCellTools({ cell });

    dataChanged.updateStyleAttrs(cell);
    if (!cell.data) {
        if (cell.isEdge()) {
            cell.type = defaultProperties.flow.type;
        }
        cell.setData(defaultProperties.getByType(cell.type));
    }
};

const cellSelected = ({ cell }) => {
    // TODO: We should be updating this somewhere else, not here.
    if (cell.isNode()) {
        cell.data.name = cell.getLabel();
    } else {
        if (!cell.data.name && cell.getLabels) {
            const labels = cell.getLabels();
            if (labels.length) {
                cell.data.name = cell.data.isTrustBoundary ? labels[0].attrs.text.text : labels[0].attrs.label.text;
            }
        }
    }

    store.get().dispatch(CELL_SELECTED, cell);
};

const cellUnselected = ({ cell }) => {
    removeCellTools({ cell });

    if (cell.setName && cell.getData && typeof cell.getData().name !== 'undefined') {
        cell.setName(cell.getData().name);
    } else {
        console.log('Cannot set name');
    }
    
    store.get().dispatch(CELL_UNSELECTED);
    dataChanged.updateStyleAttrs(cell);
};

const listen = (graph) => {
    graph.on('edge:connected', edgeConnected);
    graph.on('cell:mouseleave', removeCellTools);
    graph.on('cell:mouseenter', mouseEnter);
    graph.on('cell:added', cellAdded(graph));
    graph.on('cell:unselected', cellUnselected);
    graph.on('cell:change:data', ({ cell }) => dataChanged.updateStyleAttrs(cell));
    graph.on('cell:selected', cellSelected);
};

export default {
    listen
};
