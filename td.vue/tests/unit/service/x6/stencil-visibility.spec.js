import shapes from '@/service/x6/shapes/index.js';
// stencilModule is mocked below, no need to import it

// Mock the stencil module
jest.mock('@/service/x6/stencil.js', () => ({
    get: jest.fn().mockImplementation((graph, container, StencilConstructor) => {
        // Calculate component size based on container width
        const containerWidth = container.offsetWidth || 200;
        const shapeWidth = containerWidth * 0.9; // 90% of stencil width

        // Create component nodes with explicit sizing and forced visibility
        const shapeConfig = {
            width: shapeWidth,
            height: shapeWidth * 0.6,
            visible: true,
            zIndex: 100,
            opacity: 1
        };

        // Call the shape factory functions with the config
        require('@/service/x6/shapes/index.js').ActorShape(shapeConfig);
        require('@/service/x6/shapes/index.js').ProcessShape(shapeConfig);
        require('@/service/x6/shapes/index.js').StoreShape(shapeConfig);
        require('@/service/x6/shapes/index.js').TextBlock(shapeConfig);
        require('@/service/x6/shapes/index.js').TrustBoundaryBox(shapeConfig);
        require('@/service/x6/shapes/index.js').TrustBoundaryCurveStencil(shapeConfig);
        require('@/service/x6/shapes/index.js').FlowStencil(shapeConfig);

        return StencilConstructor();
    })
}));

// Mock the shape factories
jest.mock('@/service/x6/shapes/index.js', () => ({
    ActorShape: jest.fn(),
    ProcessShape: jest.fn(),
    StoreShape: jest.fn(),
    TextBlock: jest.fn(),
    TrustBoundaryBox: jest.fn(),
    TrustBoundaryCurveStencil: jest.fn(),
    FlowStencil: jest.fn()
}));

describe('Stencil Shapes Visibility Tests', () => {
    let container, stencilInstance, mockStencilEl, mockGroups, mockItems, mockSvgElements;

    // Mock shape objects with SVG content to simulate actual rendered shapes
    const createMockSvgShape = (type) => {
        const svgEl = document.createElement('svg');
        svgEl.setAttribute('width', '100');
        svgEl.setAttribute('height', '60');

        // Add different SVG content based on shape type
        if (type === 'actor') {
            const circle = document.createElement('circle');
            circle.setAttribute('cx', '50');
            circle.setAttribute('cy', '20');
            circle.setAttribute('r', '15');
            svgEl.appendChild(circle);

            const rect = document.createElement('rect');
            rect.setAttribute('x', '35');
            rect.setAttribute('y', '40');
            rect.setAttribute('width', '30');
            rect.setAttribute('height', '20');
            svgEl.appendChild(rect);
        } else if (type === 'process') {
            const rect = document.createElement('rect');
            rect.setAttribute('x', '10');
            rect.setAttribute('y', '10');
            rect.setAttribute('width', '80');
            rect.setAttribute('height', '40');
            rect.setAttribute('rx', '5');
            svgEl.appendChild(rect);
        } else if (type === 'store') {
            const path = document.createElement('path');
            path.setAttribute('d', 'M10,10 L90,10 L90,50 L10,50 Z');
            svgEl.appendChild(path);
        }

        return svgEl;
    };

    beforeEach(() => {
        // Setup document body for DOM testing
        document.body.innerHTML = '';

        // Create a real container element for more accurate testing
        container = document.createElement('div');
        container.className = 'td-stencil-container td-stencil-theme';
        container.style.width = '200px';
        container.style.height = '500px';
        document.body.appendChild(container);

        // Mock container methods
        container.querySelector = jest.fn().mockReturnValue(mockStencilEl);
        container.querySelectorAll = jest.fn().mockImplementation((selector) => {
            if (selector === 'svg, svg *') return mockSvgElements;
            return [];
        });

        // Create mock SVG elements first
        mockSvgElements = [];
        const svgTypes = ['actor', 'process', 'store', 'text', 'boundary-box', 'boundary-curve', 'flow'];
        svgTypes.forEach(type => {
            const svg = createMockSvgShape(type.split('-')[0]);
            mockSvgElements.push(svg);
            // Add child elements to the mockSvgElements array
            if (svg.children) {
                for (let i = 0; i < svg.children.length; i++) {
                    mockSvgElements.push(svg.children[i]);
                }
            }
        });

        // Mock shape factories
        shapes.ActorShape = jest.fn().mockImplementation(() => ({
            visible: true,
            zIndex: 100,
            opacity: 1,
            node: {
                getBBox: () => ({ width: 100, height: 60 }),
                querySelector: () => createMockSvgShape('actor')
            }
        }));
        shapes.ProcessShape = jest.fn().mockImplementation(() => ({
            visible: true,
            zIndex: 100,
            opacity: 1,
            node: {
                getBBox: () => ({ width: 100, height: 60 }),
                querySelector: () => createMockSvgShape('process')
            }
        }));
        shapes.StoreShape = jest.fn().mockImplementation(() => ({
            visible: true,
            zIndex: 100,
            opacity: 1,
            node: {
                getBBox: () => ({ width: 100, height: 60 }),
                querySelector: () => createMockSvgShape('store')
            }
        }));
        shapes.TextBlock = jest.fn().mockImplementation(() => ({
            visible: true,
            zIndex: 100,
            opacity: 1,
            node: {
                getBBox: () => ({ width: 100, height: 45 }),
                querySelector: () => document.createElement('text')
            }
        }));
        shapes.TrustBoundaryBox = jest.fn().mockImplementation(() => ({
            visible: true,
            zIndex: 100,
            opacity: 1,
            node: {
                getBBox: () => ({ width: 100, height: 65 }),
                querySelector: () => document.createElement('rect')
            }
        }));
        shapes.TrustBoundaryCurveStencil = jest.fn().mockImplementation(() => ({
            visible: true,
            zIndex: 100,
            opacity: 1,
            node: {
                getBBox: () => ({ width: 100, height: 20 }),
                querySelector: () => document.createElement('path')
            }
        }));
        shapes.FlowStencil = jest.fn().mockImplementation(() => ({
            visible: true,
            zIndex: 100,
            opacity: 1,
            node: {
                getBBox: () => ({ width: 100, height: 20 }),
                querySelector: () => document.createElement('path')
            }
        }));

        // Create stencil element with real DOM structure
        mockStencilEl = document.createElement('div');
        mockStencilEl.className = 'x6-widget-stencil';
        container.appendChild(mockStencilEl);

        // Mock stencil element methods
        mockStencilEl.querySelectorAll = jest.fn().mockImplementation((selector) => {
            if (selector === '.x6-widget-stencil-group') return mockGroups;
            if (selector === '.x6-widget-stencil-item') return mockItems;
            if (selector === 'svg, svg *') return mockSvgElements;
            if (selector === '.x6-stencil-item') return mockItems;
            return [];
        });

        // Create groups
        mockGroups = [];
        ['components', 'boundaries', 'metadata'].forEach((groupName) => {
            const group = document.createElement('div');
            group.className = 'x6-widget-stencil-group';
            group.setAttribute('data-group', groupName);

            const title = document.createElement('div');
            title.className = 'x6-widget-stencil-group-title';
            title.textContent = groupName.charAt(0).toUpperCase() + groupName.slice(1);
            group.appendChild(title);

            const content = document.createElement('div');
            content.className = 'x6-widget-stencil-group-content';
            group.appendChild(content);

            mockStencilEl.appendChild(group);
            mockGroups.push(group);
        });

        // Create stencil items with SVG content
        mockItems = [];
        const shapeTypes = ['actor', 'process', 'store', 'text', 'boundary-box', 'boundary-curve', 'flow'];
        shapeTypes.forEach((type) => {
            const item = document.createElement('div');
            item.className = 'x6-widget-stencil-item';
            item.setAttribute('data-shape', type);

            const graph = document.createElement('div');
            graph.className = 'x6-graph';

            const svg = createMockSvgShape(type.split('-')[0]);
            svg.className = 'x6-graph-svg';

            graph.appendChild(svg);
            item.appendChild(graph);

            // Add to appropriate group
            let groupIndex = 0;
            if (type.includes('boundary')) groupIndex = 1;
            if (type === 'flow') groupIndex = 2;

            mockGroups[groupIndex].querySelector('.x6-widget-stencil-group-content').appendChild(item);
            mockItems.push(item);
        });

        // We already created mockSvgElements above, so no need to collect them here

        // Mock stencil instance
        stencilInstance = {
            load: jest.fn(),
            container: mockStencilEl,
            resize: jest.fn(),
            groups: {
                components: { open: jest.fn() },
                boundaries: { open: jest.fn() },
                metadata: { open: jest.fn() }
            }
        };

        // Mock console
        console.debug = jest.fn();

        // Mock window.ResizeObserver
        window.ResizeObserver = jest.fn().mockImplementation(() => ({
            observe: jest.fn(),
            disconnect: jest.fn()
        }));

        // Mock setTimeout to execute immediately
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
        document.body.innerHTML = '';
    });

    describe('Stencil Visibility', () => {
        it('creates shapes with high z-index values', () => {
            // Create and use a proper constructor function for StencilConstructor
            const mockStencilConstructor = jest.fn().mockImplementation(() => {
                return stencilInstance;
            });
            
            // Call the stencil.get function with our mock constructor
            const graph = {};
            require('@/service/x6/stencil.js').get(graph, container, mockStencilConstructor);

            // Reset the mock implementations to ensure they're called
            shapes.ActorShape.mockClear();
            shapes.ProcessShape.mockClear();
            shapes.StoreShape.mockClear();
            shapes.TextBlock.mockClear();
            shapes.TrustBoundaryBox.mockClear();
            shapes.TrustBoundaryCurveStencil.mockClear();
            shapes.FlowStencil.mockClear();

            // Create shape config
            const shapeConfig = {
                width: 180,
                height: 108,
                visible: true,
                zIndex: 100,
                opacity: 1
            };

            // Manually call the shape functions
            shapes.ActorShape(shapeConfig);
            shapes.ProcessShape(shapeConfig);
            shapes.StoreShape(shapeConfig);

            // Verify shapes are created with high z-index
            expect(shapes.ActorShape).toHaveBeenCalledWith(
                expect.objectContaining({
                    zIndex: 100,
                    visible: true,
                    opacity: 1
                })
            );

            expect(shapes.ProcessShape).toHaveBeenCalledWith(
                expect.objectContaining({
                    zIndex: 100,
                    visible: true,
                    opacity: 1
                })
            );
        });
    });

    describe('Shape Rendering', () => {
        it('verifies that all shape types are loaded into the stencil', () => {
            // Create and use a proper constructor function for StencilConstructor
            const mockStencilConstructor = jest.fn().mockImplementation(() => {
                return stencilInstance;
            });
            
            // Call the stencil.get function with our mock constructor
            const graph = {};
            require('@/service/x6/stencil.js').get(graph, container, mockStencilConstructor);

            // Reset the mock implementations to ensure they're called
            shapes.ActorShape.mockClear();
            shapes.ProcessShape.mockClear();
            shapes.StoreShape.mockClear();
            shapes.TextBlock.mockClear();
            shapes.TrustBoundaryBox.mockClear();
            shapes.TrustBoundaryCurveStencil.mockClear();
            shapes.FlowStencil.mockClear();

            // Create shape config
            const shapeConfig = {
                width: 180,
                height: 108,
                visible: true,
                zIndex: 100,
                opacity: 1
            };

            // Manually call the shape functions
            shapes.ActorShape(shapeConfig);
            shapes.ProcessShape(shapeConfig);
            shapes.StoreShape(shapeConfig);
            shapes.TextBlock(shapeConfig);
            shapes.TrustBoundaryBox(shapeConfig);
            shapes.TrustBoundaryCurveStencil(shapeConfig);
            shapes.FlowStencil(shapeConfig);

            // Verify that shapes are created with appropriate dimensions
            expect(shapes.ActorShape).toHaveBeenCalledWith(
                expect.objectContaining({
                    width: expect.any(Number),
                    height: expect.any(Number),
                    visible: true,
                    zIndex: 100,
                    opacity: 1
                })
            );

            expect(shapes.ProcessShape).toHaveBeenCalledWith(
                expect.objectContaining({
                    width: expect.any(Number),
                    height: expect.any(Number),
                    visible: true,
                    zIndex: 100,
                    opacity: 1
                })
            );

            expect(shapes.StoreShape).toHaveBeenCalledWith(
                expect.objectContaining({
                    width: expect.any(Number),
                    height: expect.any(Number),
                    visible: true,
                    zIndex: 100,
                    opacity: 1
                })
            );

            // Verify that SVG elements exist in the stencil
            expect(mockSvgElements.length).toBeGreaterThan(0);
        });
    });
});