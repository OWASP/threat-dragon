/**
 * @name data-changed
 * @description Handles the change:data event to update the UI styles
 */

import store from '@/store/index.js';
import { CELL_DATA_UPDATED } from '@/store/actions/cell.js';
import threats from '@/service/threats/index.js';
import defaultProperties from '@/service/entity/default-properties.js';

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
    }
};

const updateStyleAttrs = (cell) => {
    const cellData = cell.getData();

    // New UI elements will not have any cell data
    if (!cellData) {
        console.debug('No style update for cell');
        return;
    }

    if (cell.data) {
        cell.data.hasOpenThreats = threats.hasOpenThreats(cell.data);
        store.get().dispatch(CELL_DATA_UPDATED, cell.data);
    }

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

    if (cell.updateStyle) {
        console.debug('Update cell style');
        cell.updateStyle(color, strokeDasharray, strokeWidth, sourceMarker);
    }
};

const updateName = (cell) => {
    if (!cell || !cell.setName || !cell.getData) {
        console.debug('Name update ignored for empty cell');
    } else {
        // console.debug('Update name for cell: ' + cell.getData().name);
        cell.setName(cell.getData().name);
    }
};

const updateProperties = (cell) => {
    if (cell) {
        if (cell.data) {
            console.debug('Update properties for cell: ' + cell.getData().name);
        } else {
            if (cell.isEdge()) {
                cell.type = defaultProperties.flow.type;
                console.debug('Edge cell given type: ' + cell.type);
            }
            cell.setData(defaultProperties.getByType(cell.type));
            console.debug('Setting properties for cell: ' + cell.getData().name);
        }
        store.get().dispatch(CELL_DATA_UPDATED, cell.data);
    } else {
        console.debug('No cell data to update');
    }
};

export default {
    updateName,
    updateStyleAttrs,
    updateProperties
};
