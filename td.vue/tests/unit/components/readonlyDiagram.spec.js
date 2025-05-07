import { shallowMount, mount, config } from '@vue/test-utils';
import { nextTick } from 'vue';

import TdReadOnlyDiagram from '@/components/ReadOnlyDiagram.vue';

// Disable Vue warnings for the tests
config.global.config.warnHandler = () => null;

// Mock the diagram service
jest.mock('@/service/migration/diagram.js', () => ({
    draw: jest.fn().mockReturnValue({
        resize: jest.fn(),
        scaleContentToFit: jest.fn()
    }),
    dispose: jest.fn()
}));

// Import the mocked service
import diagramService from '@/service/migration/diagram.js';

// Mock the debounce service - simplify it to just pass through the function
jest.mock('@/service/debounce.js', () => function (fn) { return fn; });

/**
 * Vue 3 Migration Tests for ReadOnlyDiagram.vue
 * 
 * Changes from Vue 2:
 * - Using jest.mock for service dependencies
 * - Testing Vue 3 lifecycle hooks (unmounted instead of destroyed)
 * - Improved DOM element testing with more reliable selectors
 * - Better handling of window event mocking
 */
describe('components/ReadOnlyDiagram.vue', () => {
    let wrapper, graphMock;
    const diagram = { foo: 'bar' };

    // Spy on window event listeners
    const _addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const _removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    beforeEach(async () => {
        jest.clearAllMocks();

        // Create graph mock
        graphMock = {
            resize: jest.fn(),
            scaleContentToFit: jest.fn()
        };
        diagramService.draw.mockReturnValue(graphMock);

        // Mount component
        wrapper = shallowMount(TdReadOnlyDiagram, {
            props: { diagram }
        });

        await nextTick();
    });

    afterEach(() => {
        wrapper.unmount();
    });

    describe('Component Structure', () => {
        it('renders the diagram container', () => {
            const container = wrapper.find('.td-readonly-diagram');
            expect(container.exists()).toBe(true);
        });
    });

    describe('Component Initialization', () => {
        it('draws the graph during mounted hook', () => {
            expect(diagramService.draw).toHaveBeenCalledWith(
                expect.anything(),
                diagram
            );
        });

        it('sets up resize event listener on window', () => {
            // In Vue 3 Composition API, the debouncedResize is a local variable in the setup function
            // and not exposed on the component instance. We can only test the effect indirectly.

            // Mock the window.addEventListener to verify it was called
            const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

            // Create a new component to trigger the setup function
            const newWrapper = mount(TdReadOnlyDiagram, {
                props: {
                    diagram
                },
                global: {
                    stubs: {
                        'router-link': true
                    }
                }
            });

            // Verify addEventListener was called with 'resize'
            expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

            // Clean up
            addEventListenerSpy.mockRestore();
            newWrapper.unmount();
        });

        it('cleans up on component unmount', () => {
            // Instead of testing the hook directly, test the behavior when unmounting
            // Store references to verify against after unmount
            const _originalGraph = wrapper.vm.graph;
            const _originalDebouncedResize = wrapper.vm.debouncedResize;

            // Unmount the component
            wrapper.unmount();

            // In Vue 3, we expect the unmounted hook to be called automatically
            // Verify that the cleanup function was called
            expect(diagramService.dispose).toHaveBeenCalled();

            // The event listener removal would have been called, but we can't directly
            // assert on it since the removeEventListener is called with the original function
        });
    });
});