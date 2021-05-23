/**
 * @name events
 * @description Event listeners for the graph
 */

import trustBoundary from '../shapes/trust-boundary.js';

// We need to add the router and connector data when a new edge is added.
// https://x6.antv.vision/en/docs/tutorial/intermediate/events
// If we do not, it is just a straight line with no collision detection
// This may be what we want in some cases
const edgeConnected = ({ isNew, edge }) => {
    if (isNew) {
        edge.connector = 'rounded';
    }
};

const removeCellTools = ({ cell }) => {
    if (cell.hasTools()) {
        cell.removeTools();
    }
};

const cellAdded = ({ cell }) => {
    removeCellTools({ cell });
    // Trust boundaries tend to need to be bigger than the size provided by the stencil
    if (cell.constructor.name === trustBoundary.name) {
        cell.resize(250, 500);
    }
};

const mouseEnter = ({ cell }) => {
    const tools = [ 'boundary', 'button-remove' ];
    if (!cell.isNode()) {
        tools.push('vertices');
    }
    cell.addTools(tools);
};

const listen = (graph) => {
    graph.on('edge:connected', edgeConnected);
    graph.on('cell:mouseleave', removeCellTools);
    graph.on('cell:mouseenter', mouseEnter);
    graph.on('cell:changed:position', removeCellTools);
    graph.on('cell:added', cellAdded);
    graph.on('cell:unselected', removeCellTools);
};

export default {
    listen
};
