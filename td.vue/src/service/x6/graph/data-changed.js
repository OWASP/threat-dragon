/**
 * @name data-changed
 * @description Handles the change:data event to update the UI styles
 */

import threats from '../../threats/index.js';

const styles = {
    default: {
        color: '#333333',
        sourceMarker: 'block',
        strokeDasharray: null,
        strokeWidth: 1.5,
        targetMarker: 'block'
    },
    hasOpenThreats: {
        color: 'red',
        strokeWidth: 2.5
    },
    outOfScope: {
        strokeDasharray: '4 3'
    },
    trustBoundary: {
        strokeDasharray: '7 5',
        strokeWidth: 3.0
    },
    unencrypted: {
        color: 'red',
        d: 'M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2zM3 8a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H3z'
    }
};

const edgeUpdater = (edge, color, dash, strokeWidth, sourceMarker) => {
    const data = edge.getData();
    if (data.isTrustBoundary) {
        edge.setAttrByPath('line/stroke', styles.trustBoundary.color);
        edge.setAttrByPath('line/strokeDasharray', styles.trustBoundary.strokeDasharray);
        edge.setAttrByPath('line/strokeWidth', styles.trustBoundary.strokeWidth);
        edge.setAttrByPath('line/sourceMarker', '');
        edge.setAttrByPath('line/targetMarker', '');
    } else {
        edge.setAttrByPath('line/stroke', color);
        edge.setAttrByPath('line/strokeDasharray', dash);
        edge.setAttrByPath('line/strokeWidth', strokeWidth);
        edge.setAttrByPath('line/sourceMarker/name', sourceMarker);
        edge.setAttrByPath('line/targetMarker/name', styles.default.targetMarker);
    }
};

const updateStyleAttrs = (cell) => {
    const cellData = cell.getData();

    // New UI elements will not have any cell data
    if (!cellData || !cell.data) {
        return;
    }

    cell.data.hasOpenThreats = threats.hasOpenThreats(cell.data);

    let { color, strokeDasharray, strokeWidth, sourceMarker } = styles.default;

    if (cellData.hasOpenThreats) {
        color = styles.hasOpenThreats.color;
        strokeWidth = styles.hasOpenThreats.strokeWidth;
    }

    if (cellData.outOfScope) {
        strokeDasharray = styles.outOfScope.strokeDasharray;
    }

    if (!cellData.isBidirectional) {
        sourceMarker = '';
    }

    if (cell.isEdge()) {
        edgeUpdater(cell, color, strokeDasharray, strokeWidth, sourceMarker);
        return;
    }

    if (cell.updateStyle) {
        cell.updateStyle(color, strokeDasharray, strokeWidth);
    }
};

const updateName = (cell) => {

    if (!cell || !cell.setName || !cell.getData) {
        console.debug('Name update ignored for empty cell');
    } else {
        console.debug('Updating name for cell ' + cell.getData().name);
        cell.setName(cell.getData().name);
    }
};

export default {
    updateName,
    updateStyleAttrs
};
