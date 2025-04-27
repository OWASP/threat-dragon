/**
 * @name events
 * @description Event listeners for the graph
 */
import dataChanged from './data-changed.js';
import shapes from '@/service/x6/shapes';
import store from '@/store/index.js';
import { CELL_SELECTED, CELL_UNSELECTED } from '@/store/actions/cell.js';
import { THREATMODEL_MODIFIED } from '@/store/actions/threatmodel.js';
import defaultProperties from '@/service/entity/default-properties.js';
import logger from '@/utils/logger.js';
import { tc } from '@/i18n/index.js';

// Create a context-specific logger
const log = logger.getLogger('graph:events');

// Helper function to get the localized default name for a cell type
const getLocalizedDefaultName = (cell) => {
    // Add debug logging to help diagnose issues
    log.debug('Getting localized name for cell', {
        shape: cell.shape,
        type: cell.data?.type,
        constructor: cell.constructor?.name
    });
    
    // First try to determine the type from cell.data.type
    if (cell.data && cell.data.type) {
        switch (cell.data.type) {
        case 'tm.Actor':
            return tc('threatmodel.shapes.actor');
        case 'tm.Process':
            return tc('threatmodel.shapes.process');
        case 'tm.Store':
            return tc('threatmodel.shapes.store');
        case 'tm.Text':
            return tc('threatmodel.shapes.text');
        case 'tm.Boundary':
        case 'tm.BoundaryBox':
            return tc('threatmodel.shapes.trustBoundary');
        case 'tm.Flow':
            return tc('threatmodel.shapes.flowStencil');
        }
    }
    
    // Get the shape name and constructor name
    const shape = cell.shape || '';
    const constructorName = cell.constructor?.name || '';
    
    // More reliable type detection using a combination of methods
    // Check for actor
    if (shape === 'actor' ||
        constructorName.includes('Actor') ||
        (cell.data && cell.data.providesAuthentication !== undefined)) {
        return tc('threatmodel.shapes.actor');
    }
    
    // Check for process
    if (shape === 'process' ||
        constructorName.includes('Process') ||
        (cell.data && (cell.data.isWebApplication !== undefined ||
                      cell.data.handlesCardPayment !== undefined))) {
        return tc('threatmodel.shapes.process');
    }
    
    // Check for store
    if (shape === 'store' ||
        constructorName.includes('Store') ||
        (cell.data && (cell.data.isALog !== undefined ||
                      cell.data.storesCredentials !== undefined))) {
        return tc('threatmodel.shapes.store');
    }
    
    // Check for text
    if (shape === 'td-text-block' ||
        constructorName.includes('Text') ||
        (cell.data && cell.data.type === 'tm.Text')) {
        return tc('threatmodel.shapes.text');
    }
    
    // Check for boundary box
    if (shape === 'trust-boundary-box' ||
        constructorName.includes('BoundaryBox') ||
        (cell.data && cell.data.isTrustBoundary === true)) {
        return tc('threatmodel.shapes.trustBoundary');
    }
    
    // Check for boundary curve
    if (shape === 'trust-boundary-curve' ||
        constructorName.includes('BoundaryCurve')) {
        return tc('threatmodel.shapes.trustBoundary');
    }
    
    // Check for flow
    if (shape === 'flow' ||
        constructorName.includes('Flow') ||
        (cell.data && (cell.data.isBidirectional !== undefined ||
                      cell.data.protocol !== undefined))) {
        return tc('threatmodel.shapes.flowStencil');
    }
    
    // Fallback to a capitalized shape name if we can't determine the type
    log.debug('Could not determine cell type, using fallback', { shape });
    return shape.charAt(0).toUpperCase() + shape.slice(1);
};

const showPorts = (show) => {
    const container = document.getElementById('graph-container');
    const ports = container.querySelectorAll('.x6-port-body');
    for (let i = 0, len = ports.length; i < len; i += 1) {
        ports[i].style.visibility = show ? 'visible' : 'hidden';
    }
};

const canvasResized = ({ width, height }) => {
    log.debug('canvas resized', { width, height });
    showPorts(false);
};

const edgeChangeVertices =
    () =>
        ({ edge }) => {
            if (edge.constructor.name === 'Edge') {
                log.debug('vertex for unformatted edge/flow');
            }
        };

const edgeConnected =
    (graph) =>
        ({ edge }) => {
            if (edge.constructor.name === 'Edge') {
                log.debug('connected unformatted edge/flow');
                const flow = shapes.Flow.fromEdge(edge);

                // Ensure the flow has all required properties
                if (!flow.data) {
                    flow.setData(Object.assign({}, defaultProperties.flow));
                } else {
                    // Ensure all default flow properties exist on this flow
                    const defaultProps = defaultProperties.flow;
                    for (const key in defaultProps) {
                        if (flow.data[key] === undefined) {
                            flow.data[key] = defaultProps[key];
                        }
                    }
                }

                // Add the flow to the graph
                graph.addEdge(flow);
                edge.remove();
                edge = flow;

                // Ensure the flow has a name
                if (edge.data && edge.data.name) {
                    edge.setName(edge.data.name);
                }

                // Select the new flow
                graph.select(edge);

                // Dispatch CELL_SELECTED to update the properties panel
                store.get().dispatch(CELL_SELECTED, edge);
                dataChanged.updateProperties(edge);
                dataChanged.updateStyleAttrs(edge);
            }
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

        // For edges, ensure they have all required properties
        if (cell.data) {
            // Ensure all default flow properties exist on this edge
            const defaultProps = defaultProperties.flow;
            let needsUpdate = false;

            for (const key in defaultProps) {
                if (cell.data[key] === undefined) {
                    cell.data[key] = defaultProps[key];
                    needsUpdate = true;
                }
            }

            // Don't update the name on mouseEnter - only ensure other properties are set
            if (needsUpdate) {
                dataChanged.updateProperties(cell);
            }
        } else {
            // Initialize data object with default properties if it doesn't exist
            // But don't set a name - that should only happen on explicit selection
            const defaultProps = { ...defaultProperties.flow };
            cell.setData(defaultProps);
            dataChanged.updateProperties(cell);
        }
    }
    
    // Add tools to the cell
    cell.addTools(tools);

    // Show ports
    showPorts(true);
};

const cellAdded =
    (graph) =>
        ({ cell }) => {
            log.debug('cell added with shape', { shape: cell.shape });
            // ensure selection of other components is removed
            graph.resetSelection();

            // Flow and trust boundary stencils need to be converted
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
                    log.warn('Unknown edge stencil');
                }
                cell.remove();
                cell = edge;

                // Ensure the edge has all required properties
                if (!cell.data) {
                    cell.setData(Object.assign({}, defaultProperties.flow));
                } else {
                    // Ensure all default flow properties exist on this edge
                    const defaultProps = defaultProperties.flow;
                    for (const key in defaultProps) {
                        if (cell.data[key] === undefined) {
                            cell.data[key] = defaultProps[key];
                        }
                    }
                    
                    // Ensure the cell has a localized name
                    if (!cell.data.name) {
                        cell.data.name = getLocalizedDefaultName(cell);
                    }
                }

                if (cell.data && cell.data.name) {
                    cell.setName(cell.data.name);
                }
            }
            
            // Ensure all cells have data and a localized name property
            if (!cell.data) {
                const defaultName = getLocalizedDefaultName(cell);
                cell.setData({ name: defaultName });
            } else if (!cell.data.name) {
                cell.data.name = getLocalizedDefaultName(cell);
            }

            mouseLeave({ cell });

            // boundary boxes must not overlap other diagram components
            if (cell.shape === 'trust-boundary-box') {
                cell.zIndex = -1;
            }

            store.get().dispatch(CELL_SELECTED, cell);
            dataChanged.updateProperties(cell);
            dataChanged.updateStyleAttrs(cell);

            if (cell.shape === 'edge') {
                log.debug('added new edge (flow parent)');
                // Convert unformatted edge to flow
                const flow = shapes.Flow.fromEdge(cell);

                // Ensure the flow has all required properties
                if (!flow.data) {
                    flow.setData(Object.assign({}, defaultProperties.flow));
                } else {
                    // Ensure all default flow properties exist on this flow
                    const defaultProps = defaultProperties.flow;
                    for (const key in defaultProps) {
                        if (flow.data[key] === undefined) {
                            flow.data[key] = defaultProps[key];
                        }
                    }
                }

                graph.addEdge(flow);
                cell.remove();
                cell = flow;

                if (cell.data && cell.data.name) {
                    cell.setName(cell.data.name);
                }

                // Re-dispatch CELL_SELECTED with the new flow object
                store.get().dispatch(CELL_SELECTED, cell);
            }

            // Select all cells except paths and trust boundaries
            if (
                cell.shape !== 'path' &&
                cell.shape !== 'trust-boundary-curve'
            ) {
                graph.select(cell);
            }
        };

const cellDeleted = () => {
    log.debug('cell deleted');
    store.get().dispatch(THREATMODEL_MODIFIED);
};

const cellSelected =
    (graph) =>
        ({ cell }) => {
            // try and get the cell name
            if (cell.data) {
                if (cell.data.name) {
                    log.debug('Cell selected', { name: cell.data.name });
                } else if (cell.getLabels) {
                    const labels = cell.getLabels();
                    if (labels.length && labels[0].attrs.label) {
                        cell.data.name = labels[0].attrs.label.text;
                        log.debug('Cell selected with label', { name: cell.data.name });
                    } else {
                        // Set a localized default name based on cell type
                        const defaultName = getLocalizedDefaultName(cell);
                        cell.data.name = defaultName;
                        log.debug('Set localized default name for cell', {
                            name: defaultName,
                            type: cell.data?.type,
                            shape: cell.shape,
                            constructor: cell.constructor?.name
                        });
                        
                        // Make sure to update the cell properties
                        dataChanged.updateProperties(cell);
                    }
                } else {
                    // Set a localized default name based on cell type
                    const defaultName = getLocalizedDefaultName(cell);
                    cell.data.name = defaultName;
                    log.debug('Set localized default name for cell', {
                        name: defaultName,
                        type: cell.data?.type,
                        shape: cell.shape,
                        constructor: cell.constructor?.name
                    });
                    
                    // Make sure to update the cell properties
                    dataChanged.updateProperties(cell);
                }
            } else {
                // Initialize data object with default properties if it doesn't exist
                const defaultName = getLocalizedDefaultName(cell);
                cell.setData({ name: defaultName });
                log.debug('Initialized cell data with localized default name', {
                    name: defaultName,
                    shape: cell.shape,
                    constructor: cell.constructor?.name
                });
                
                // Make sure to update the cell properties
                dataChanged.updateProperties(cell);
            }

            // Handle unformatted edge selection
            if (cell.shape === 'edge') {
                log.debug('selected unformatted edge/flow');
                const flow = shapes.Flow.fromEdge(cell);
                graph.addEdge(flow);
                cell.remove();
                cell = flow;

                // Ensure the flow has a name
                if (cell.data && cell.data.name) {
                    cell.setName(cell.data.name);
                }

                // Make sure the flow has all required properties
                if (!cell.data) {
                    cell.setData(Object.assign({}, defaultProperties.flow));
                } else {
                    // Ensure all default flow properties exist on this flow
                    const defaultProps = defaultProperties.flow;
                    for (const key in defaultProps) {
                        if (cell.data[key] === undefined) {
                            cell.data[key] = defaultProps[key];
                        }
                    }
                }

                // Select the new flow object
                graph.select(cell);
            }

            // Always dispatch CELL_SELECTED for any cell type
            store.get().dispatch(CELL_SELECTED, cell);
            dataChanged.updateProperties(cell);
            dataChanged.updateStyleAttrs(cell);
            dataChanged.setType(cell);
        };

const cellUnselected = ({ cell }) => {
    log.debug('cell unselected');
    mouseLeave({ cell });
    store.get().dispatch(CELL_UNSELECTED);
};

const cellDataChanged = ({ cell }) => {
    // Don't dispatch CELL_SELECTED here - only update the style attributes
    // This prevents cells from being "selected" when their data changes
    // store.get().dispatch(CELL_SELECTED, cell);
    
    // Just update the style attributes and mark the model as modified
    dataChanged.updateStyleAttrs(cell);
    store.get().dispatch(THREATMODEL_MODIFIED);
    
    log.debug('Cell data changed but not selecting cell', {
        cellType: cell.data?.type,
        cellShape: cell.shape
    });
};

const listen = (graph) => {
    graph.on('resize', canvasResized);
    graph.on('edge:change:vertices', edgeChangeVertices(graph));
    graph.on('edge:connected', edgeConnected(graph));
    graph.on('edge:dblclick', cellSelected(graph));
    graph.on('edge:move', cellSelected(graph));
    graph.on('cell:mouseleave', mouseLeave);
    graph.on('cell:mouseenter', mouseEnter);
    graph.on('cell:added', cellAdded(graph));
    graph.on('cell:removed', cellDeleted);
    graph.on('cell:change:data', cellDataChanged);
    graph.on('cell:selected', cellSelected(graph));
    graph.on('cell:unselected', cellUnselected);
    graph.on('node:move', cellSelected(graph));
    
    // Log all registered event handlers for debugging
    log.debug('Registered event handlers', {
        handlers: [
            'resize', 'edge:change:vertices', 'edge:connected', 'edge:dblclick',
            'edge:move', 'cell:mouseleave', 'cell:mouseenter', 'cell:added',
            'cell:removed', 'cell:change:data', 'cell:selected', 'cell:unselected',
            'node:move'
        ]
    });
};

const removeListeners = (graph) => {
    graph.off('resize', canvasResized);
    graph.off('edge:change:vertices', edgeChangeVertices(graph));
    graph.off('edge:connected', edgeConnected(graph));
    graph.off('edge:dblclick', cellSelected(graph));
    graph.off('edge:move', cellSelected(graph));
    graph.off('cell:mouseleave', mouseLeave);
    graph.off('cell:mouseenter', mouseEnter);
    graph.off('cell:added', cellAdded(graph));
    graph.off('cell:removed', cellDeleted);
    graph.off('cell:change:data', cellDataChanged);
    graph.off('cell:selected', cellSelected(graph));
    graph.off('cell:unselected', cellUnselected);
    graph.off('node:move', cellSelected(graph));
    
    log.debug('Removed all event handlers');
};

export default {
    listen,
    removeListeners
};
