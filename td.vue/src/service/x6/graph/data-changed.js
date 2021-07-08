/**
 * @name data-changed
 * @description Handles the change:data event to update the UI styles
 */
import actor from '../shapes/actor.js';
import processShape from '../shapes/process.js';
import store from '../shapes/store.js';

const styles = {
    default: {
        color: '#333333',
        strokeDasharray: null,
        strokeWidth: 1.0
    },
    hasOpenThreats: {
        color: 'red'
    },
    outOfScope: {
        strokeDasharray: '2 2'
    },
    trustBoundary: {
        strokeDasharray: '5 5',
        strokeWidth: 3
    },
    unencrypted: {
        color: 'red',
        d: 'M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2zM3 8a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H3z'
    }
};

const edgeUpdater = (edge, color, dash, strokeWidth) => {
    const data = edge.getData();
    if (data.isTrustBoundary) {
        edge.setAttrByPath('line/stroke', styles.trustBoundary.color);
        edge.setAttrByPath('line/strokeDasharray', styles.trustBoundary.strokeDasharray);
        edge.setAttrByPath('line/strokeWidth', styles.trustBoundary.strokeWidth);
        edge.setAttrByPath('line/sourceMarker', '');
        edge.setAttrByPath('line/targetMarker', '');
        return;
    }

    edge.setAttrByPath('line/stroke', color);
    edge.setAttrByPath('line/strokeWidth', strokeWidth);
    edge.setAttrByPath('line/strokeDasharray', dash);
    edge.setAttrByPath('line/targetMarker/name', 'classic');
};

const getUpdateMap = () => ({
    [actor.Actor.name]: actor.updateStyle,
    [processShape.ProcessShape.name]: processShape.updateStyle,
    [store.Store.name]: store.updateStyle,
    Edge: edgeUpdater
});

const updateStyleAttrs = (cell) => {
    const cellData = cell.getData();
    
    // New UI elements will not have any cell data
    if (!cellData) {
        return;
    }

    const updateFn = getUpdateMap()[cell.constructor.name];
    if (!updateFn) {
        return;
    }

    let { color, strokeDasharray, strokeWidth } = styles.default;

    if (cellData.hasOpenThreats) {
        color = styles.hasOpenThreats.color;
        strokeWidth = 3.0;
    }

    if (cellData.outOfScope) {
        strokeDasharray = styles.outOfScope.strokeDasharray;
    }

    updateFn(cell, color, strokeDasharray, strokeWidth);
};

export default {
    updateStyleAttrs
};
