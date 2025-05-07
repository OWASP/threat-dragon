/**
 * @name data-changed
 * @description Handles the change:data event to update the UI styles
 */

import store from '@/store/index.js';
import { THREATMODEL_MODIFIED } from '@/store/actions/threatmodel.js';
import threats from '@/service/threats/index.js';
import defaultProperties from '@/service/entity/default-properties.js';
import logger from '@/utils/logger.js';

// Create a context-specific logger
const log = logger.getLogger('graph:data-changed');

// Handle the possibility that store might not have get() method in some contexts
const getStore = () => {
    if (typeof store.get === 'function') {
        return store.get();
    }
    return store;
};

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
    // Safely get cell data, handling the case where getData might not be available
    const cellData = cell.getData && typeof cell.getData === 'function'
        ? cell.getData()
        : cell.data;

    // New UI elements will not have any cell data
    if (!cellData) {
        log.debug('No style update for cell');
        return;
    }

    if (cell.data) {
        // Update hasOpenThreats property
        cell.data.hasOpenThreats = threats.hasOpenThreats(cell.data);
        
        // Only dispatch THREATMODEL_MODIFIED, not CELL_DATA_UPDATED
        // This prevents cells from being "selected" when their style is updated
        const storeInstance = getStore();
        if (typeof storeInstance?.dispatch === 'function') {
            // Don't dispatch CELL_DATA_UPDATED which can cause selection issues
            // storeInstance.dispatch(CELL_DATA_UPDATED, cell.data);
            storeInstance.dispatch(THREATMODEL_MODIFIED);
            
            log.debug('Dispatched THREATMODEL_MODIFIED but not CELL_DATA_UPDATED');
        }
    }

    // Get default styles
    let { color, strokeDasharray, strokeWidth, sourceMarker } = styles.default;

    // Apply style based on cell properties
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

    // Update the cell's visual style
    if (cell.updateStyle) {
        log.debug('Update cell style', {
            color,
            strokeDasharray,
            strokeWidth,
            sourceMarker
        });
        cell.updateStyle(color, strokeDasharray, strokeWidth, sourceMarker);
    }
};

const updateName = (cell) => {
    if (!cell || !cell.setName || !cell.getData) {
        log.warn('No cell found to update name');
    } else {
        cell.setName(cell.getData().name);
    }
};

const updateProperties = (cell) => {
    if (cell) {
        if (cell.data) {
            // Safely access cell name for logging
            const cellName = cell.getData && typeof cell.getData === 'function' ? cell.getData().name : cell.data.name || 'unnamed';
            const cellType = cell.data.type || 'unknown';
            const cellShape = cell.shape || 'unknown';
            
            log.debug('Updated properties for cell', {
                name: cellName,
                type: cellType,
                shape: cellShape
            });

            // For edges/flows, ensure all required properties exist
            if ((cell.isEdge && typeof cell.isEdge === 'function' && cell.isEdge()) || cell.shape === 'flow') {
                const defaultProps = defaultProperties.flow;
                let needsUpdate = false;

                // Ensure all default flow properties exist on this cell
                for (const key in defaultProps) {
                    if (cell.data[key] === undefined) {
                        cell.data[key] = defaultProps[key];
                        needsUpdate = true;
                    }
                }

                if (needsUpdate) {
                    log.debug('Added missing properties to edge/flow');
                }
            }
        } else {
            if (cell.isEdge && typeof cell.isEdge === 'function' && cell.isEdge()) {
                cell.type = defaultProperties.flow.type;
                log.debug('Edge cell given type', { type: cell.type });
            }
            cell.setData(defaultProperties.getByType(cell.type));
            log.debug('Default properties for cell', { shape: cell.shape, name: cell.getData().name });
        }

        // Only dispatch CELL_DATA_UPDATED if we're explicitly updating properties
        // This prevents cells from being "selected" when their properties are updated
        const storeInstance = getStore();
        if (typeof storeInstance?.dispatch === 'function') {
            // Only dispatch THREATMODEL_MODIFIED to mark the model as changed
            // Don't dispatch CELL_DATA_UPDATED which can cause selection issues
            // storeInstance.dispatch(CELL_DATA_UPDATED, cell.data);
            storeInstance.dispatch(THREATMODEL_MODIFIED);
            
            log.debug('Dispatched THREATMODEL_MODIFIED but not CELL_DATA_UPDATED');
        }
    } else {
        log.warn('No cell found to update properties');
    }
};

const setType = (cell) => {
    // fundamentally the shape is the only constant identifier
    switch (cell.shape) {
    case 'actor':
        cell.data.type = 'tm.Actor';
        break;
    case 'store':
        cell.data.type = 'tm.Store';
        break;
    case 'process':
        cell.data.type = 'tm.Process';
        break;
    case 'flow':
        cell.data.type = 'tm.Flow';
        break;
    case 'trust-boundary-box':
        cell.data.type = 'tm.BoundaryBox';
        break;
    case 'trust-boundary-curve':
    case 'trust-broundary-curve':
        cell.data.type = 'tm.Boundary';
        break;
    case 'td-text-block':
        cell.data.type = 'tm.Text';
        break;
    default:
        log.debug('Unrecognized shape');
    }
};

export default {
    updateName,
    updateStyleAttrs,
    updateProperties,
    setType
};
