/**
 * @name events
 * @description Event listeners for the graph
 */
import { CELL_SELECTED, CELL_UNSELECTED } from '../../../store/actions/cell.js';
import dataChanged from './data-changed.js';
import store from '../../../store/index.js';
import trustBoundaryCurve from '../shapes/trust-boundary-curve.js';

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
    if (cell.constructor.name === 'TrustBoundaryCurve') {
        graph.addEdge(trustBoundaryCurve.getEdgeConfig(cell.position()));
        cell.remove();
    }
    removeCellTools({ cell });

    dataChanged.updateStyleAttrs(cell);
    if (!cell.data) {
        cell.setData({
            // TODO: This is duplicated in trust-boundary-curve, maybe elsewhere.
            // Document the models used for different entity types in the docs
            // Create one function to add default data based on the type
            hasOpenThreats: false,
            threats: [],
            outOfScope: false,
            isEncrypted: false,
            isPublicNetwork: false,
            protocol: '',
            isTrustBoundary: cell.type === 'tm.Boundary' || cell.type === 'tm.BoundaryBox',
            type: cell.type
        });
    }
};

const cellSelected = ({ cell }) => {
    // TODO: Change label to name for data
    if (cell.isNode()) {
        cell.data.label = cell.getLabel();
    } else {
        const labels = cell.getLabels().filter(x => x && x.attrs && x.attrs.label && x.attrs.label.text);
        cell.data.label = labels.length ? labels[0].attrs.label.text : '';
    }

    store.get().dispatch(CELL_SELECTED, cell.getData());
};

const cellUnselected = ({ cell }) => {
    removeCellTools({ cell });
    store.get().dispatch(CELL_UNSELECTED);
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