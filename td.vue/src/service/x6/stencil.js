// Stencil implementation for diagram editing
import shapes from './shapes/index.js';
import factory from './factory.js';
import { tc } from '@/i18n/index.js';
import logger from '@/utils/logger.js';

// Create a context-specific logger
const log = logger.getLogger('service:x6:stencil');

/**
 * Gets or creates a stencil for the graph
 * @param {Object} graph - The graph instance
 * @param {HTMLElement} container - The container element
 * @param {Function} StencilConstructor - The stencil constructor (for testing)
 * @returns {Object} - A stencil instance
 */
const get = (graph, container, StencilConstructor) => {
    log.debug('Setting up stencil for diagram editor');

    let resizeObserver;

    // Function to calculate dimensions based on container size
    const calculateDimensions = () => {
        // Get container width for responsive sizing
        const containerWidth = container.offsetWidth || 200;
        // Calculate stencil dimensions based on container size
        return {
            stencilGraphWidth: containerWidth,
            containerWidth
        };
    };

    // Initial dimensions
    const { stencilGraphWidth } = calculateDimensions();

    // Define shape counts for each group
    const shapeCounts = {
        'components': 4,  // actor, process, store, text
        'boundaries': 2,  // boundaryBox, boundaryCurve
        'metadata': 1     // flow
    };

    // Calculate group heights (100px per shape)
    const getGroupHeight = (groupName) => {
        const count = shapeCounts[groupName] || 2;
        return (count * 90);  // 100px per shape
    };

    // Force a fresh translation lookup each time the stencil is created
    // This ensures we get the current locale's translations
    log.debug('Getting translations for stencil with current locale');

    // Create stencil configuration
    const stencilConfig = {
        target: graph,
        stencilGraphHeight: 'auto', // Enable auto height
        title: tc('threatmodel.stencil.title', 'Shapes'),
        collapsable: false,

        // Explicitly ensure we can see stencil content
        snapline: true,
        resizing: true,
        autoResize: true, // Enable auto resize
        height: 'auto', // Set height to auto
        groups: [
            {
                name: 'components',
                title: tc('threatmodel.stencil.components', 'Components'),
                collapsable: true,
                collapsed: false,
                graphHeight: getGroupHeight('components'), // Set explicit height
                graphWidth: stencilGraphWidth
            },
            {
                name: 'boundaries',
                title: tc('threatmodel.stencil.boundaries', 'Boundaries'),
                collapsable: true,
                collapsed: false,
                graphHeight: getGroupHeight('boundaries'), // Set explicit height
                graphWidth: stencilGraphWidth
            },
            {
                name: 'metadata',
                title: tc('threatmodel.stencil.metadata', 'Metadata'),
                collapsable: true,
                collapsed: false,
                graphHeight: getGroupHeight('metadata'), // Set explicit height
                graphWidth: stencilGraphWidth
            }
        ],
        layoutOptions: {
            columns: 1,
            center: true,
            resizeToFit: false, /* true causes shapes to be invisible */
            dx: 65, // Add horizontal spacing
            dy: 5   // Keep reduced vertical spacing between items
        },
        search: {
            placeholder: tc('threatmodel.stencil.search', 'Search shapes')
        }
    };

    // Create the stencil instance
    const stencilInstance = StencilConstructor ? new StencilConstructor(stencilConfig) : factory.stencil(stencilConfig);

    // Create component nodes with explicit sizing and forced visibility
    // Force fresh translations for all shape labels
    const actor = new shapes.ActorShape({
        width: 100,
        height: 50,
        visible: true,
        opacity: 1,  // Full opacity
        label: tc('threatmodel.shapes.actor'),
        attrs: {
            body: {
                refWidth: '100%',
                refHeight: '100%'
            }
        }
    });
    const process = new shapes.ProcessShape({
        width: 75,
        height: 75,
        visible: true,
        opacity: 1,
        label: tc('threatmodel.shapes.process'),
        attrs: {
            body: {
                refWidth: '100%',
                refHeight: '100%'
            }
        }
    });

    const store = new shapes.StoreShape({
        width: 100,
        height: 50,
        visible: true,
        opacity: 1,
        label: tc('threatmodel.shapes.store'),
        attrs: {
            topLine: {
                stroke: '#333333',
                strokeWidth: 2,
                d: 'M 0 15 L 100 15'
            },
            bottomLine: {
                stroke: '#333333',
                strokeWidth: 2,
                d: 'M 0 35 L 100 35'
            },
            label: {
                text: tc('threatmodel.shapes.store'),
                fill: '#333',
                textVerticalAnchor: 'middle',
                textAnchor: 'middle',
                refX: 0.5,
                refY: 0.5
            }
        }
    });
    const text = new shapes.TextBlock({
        width: 100,
        height: 50,
        visible: true,
        opacity: 1,
        label: tc('threatmodel.shapes.text'),
        attrs: {
            body: {
                refWidth: '100%',
                refHeight: '100%'
            }
        }
    });

    // Create boundary nodes
    const boundaryBox = new shapes.TrustBoundaryBox({
        width: 100,
        height: 50,
        visible: true,
        opacity: 1,
        attrs: {
            body: {
                refWidth: '100%',
                refHeight: '100%'
            },
            label: {
                text: tc('threatmodel.shapes.trustBoundary'),
                textAnchor: 'middle',
                textVerticalAnchor: 'middle',
                refX: 0.5, // Center horizontally
                refY: 0.5, // Position from top
                fontSize: 12,
                textWrap: {
                    width: -45, // (negative means percentage of width)
                    height: 40, // Maximum height
                    ellipsis: true // Show ellipsis when text overflows
                },
            }
        }
    });
    const boundaryCurve = new shapes.TrustBoundaryCurveStencil({
        width: 50,
        height: 50,
        visible: true,
        opacity: 1,
        attrs: {
            body: {
                refWidth: '100%',
                refHeight: '100%'
            },
            label: {
                text: tc('threatmodel.shapes.trustBoundary'),
                textWrap: {
                    width: 80,
                    height: 40,
                    ellipsis: true
                },
                fontSize: 10,
                refX: 0.5,
                refY: 0.5
            }
        }
    });

    // Create flow
    const flow = new shapes.FlowStencil({
        width: 50,
        height: 50,
        visible: true,
        opacity: 1,
        attrs: {
            body: {
                refWidth: '100%',
                refHeight: '100%'
            },
            label: {
                text: tc('threatmodel.shapes.flowStencil')
            }
        }
    });

    // Add shapes to the stencil with explicit layout options
    stencilInstance.load([actor, process, store, text], 'components');
    stencilInstance.load([boundaryBox, boundaryCurve], 'boundaries');
    stencilInstance.load([flow], 'metadata');

    // Force resize after loading if the method is available (not in tests)
    if (stencilInstance && typeof stencilInstance.resize === 'function') {
        // Resize the main stencil
        stencilInstance.resize(stencilGraphWidth, 'auto');

        // Resize each group individually
        Object.keys(shapeCounts).forEach(groupName => {
            if (stencilInstance.resizeGroup) {
                stencilInstance.resizeGroup(
                    groupName,
                    stencilGraphWidth,
                    getGroupHeight(groupName)
                );
            }
        });
    }

    // Force compact layout
    if (stencilInstance && typeof stencilInstance.layout === 'function') {
        stencilInstance.layout();
    }

    // Add custom class to help with styling
    if (stencilInstance && stencilInstance.container && stencilInstance.container.classList) {
        stencilInstance.container.classList.add('td-stencil-container');
    }

    // Add to DOM first so we can access the elements
    // Only append if both container and stencilInstance.container exist
    if (container && stencilInstance && stencilInstance.container) {
        container.appendChild(stencilInstance.container);
    }

    // Force a redraw of all groups to ensure proper sizing
    setTimeout(() => {
        if (stencilInstance && typeof stencilInstance.layout === 'function') {
            stencilInstance.layout();
        }

        log.debug('Setting stencil group heights based on shape counts');

        // Add id and name attributes to the stencil search field
        const searchField = container.querySelector('.x6-widget-stencil-search-text');
        if (searchField) {
            searchField.id = 'stencil-search-field';
            searchField.name = 'stencil-search-field';
            log.debug('Added id and name to stencil search field');
        }

        // Get all groups after they've been added to the DOM
        const groups = container.querySelectorAll('.x6-widget-stencil-group');
        log.debug('Found stencil groups', { count: groups.length });

        // Create a mapping from display titles to internal group names
        // Force a fresh translation lookup for the mapping
        const titleToName = {};
        titleToName[tc('threatmodel.stencil.components', 'Components')] = 'components';
        titleToName[tc('threatmodel.stencil.boundaries', 'Boundaries')] = 'boundaries';
        titleToName[tc('threatmodel.stencil.metadata', 'Metadata')] = 'metadata';

        groups.forEach(group => {
            // Get the title element and extract the text
            const titleEl = group.querySelector('.x6-widget-stencil-group-title');
            const displayTitle = titleEl ? titleEl.textContent.trim() : '';
            log.debug('Processing group', { title: displayTitle });

            // Map display title to internal name
            const groupName = titleToName[displayTitle] || displayTitle.toLowerCase();

            // Get the content element
            const content = group.querySelector('.x6-widget-stencil-group-content');
            if (!content) {
                log.debug('No content element found for group', { title: displayTitle });
                return;
            }

            // Calculate height using our consistent function
            const calculatedHeight = getGroupHeight(groupName);
            log.debug('Setting group height', { height: calculatedHeight, title: displayTitle, name: groupName });

            // Apply the height if the group is not collapsed
            if (!group.classList.contains('collapsed')) {
                content.style.minHeight = '200px';
                content.style.maxHeight = `${calculatedHeight}px`;
                content.style.overflowY = 'auto';

                // Force the style to be applied
                setTimeout(() => {
                    content.style.maxHeight = `${calculatedHeight}px`;
                }, 0);

                // Try to resize the group through the API as well
                if (stencilInstance.resizeGroup) {
                    stencilInstance.resizeGroup(groupName, stencilGraphWidth, calculatedHeight);
                }
            }
        });
    }, 200); // Increased timeout to ensure DOM is ready

    // Note: container.appendChild(stencilInstance.container) moved above

    // Removed setTimeout blocks previously used to force visibility/redraw.
    // Relying on initial render and ResizeObserver.

    // Setup resize observer to handle responsive behavior
    if (window.ResizeObserver) {
        resizeObserver = new ResizeObserver((_entries) => {
            // We only have one container, so we can just use the first entry
            const { stencilGraphWidth } = calculateDimensions();

            // Update stencil dimensions
            if (stencilInstance && stencilInstance.resize) {
                // Resize the main stencil
                stencilInstance.resize(stencilGraphWidth, 'auto');

                // Resize each group individually
                Object.keys(shapeCounts).forEach(groupName => {
                    if (stencilInstance.resizeGroup) {
                        stencilInstance.resizeGroup(
                            groupName,
                            stencilGraphWidth,
                            getGroupHeight(groupName)
                        );
                    }
                });
            }

            // Force compact layout on resize
            if (stencilInstance && typeof stencilInstance.layout === 'function') {
                stencilInstance.layout();
            }
        });

        // Start observing the container
        resizeObserver.observe(container);
    }

    // Return stencil with cleanup method
    const result = {
        ...stencilInstance,
        dispose: () => {
            // Cleanup resize observer when stencil is disposed
            if (resizeObserver) {
                resizeObserver.disconnect();
                resizeObserver = null;
            }

            // Clean up any event listeners or DOM elements
            const stencilEl = container.querySelector('.x6-widget-stencil');
            if (stencilEl) {
                // Remove any event listeners if needed
            }
        }
    };

    return result;
};

export default {
    get
};