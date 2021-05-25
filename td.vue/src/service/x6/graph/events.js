/**
 * @name events
 * @description Event listeners for the graph
 */
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
};

const listen = (graph) => {
    graph.on('edge:connected', edgeConnected);
    graph.on('cell:mouseleave', removeCellTools);
    graph.on('cell:mouseenter', mouseEnter);
    graph.on('cell:changed:position', removeCellTools);
    graph.on('cell:added', cellAdded(graph));
    graph.on('cell:unselected', removeCellTools);
};

export default {
    listen
};
