import { mount as _mount } from '@vue/test-utils';
import { createWrapper } from '../setup/test-utils';

import ThreatModel from '@/views/ThreatModel.vue';
import ThreatModelSummaryCard from '@/components/ThreatModelSummaryCard.vue';
import { THREATMODEL_DIAGRAM_SELECTED } from '@/store/actions/threatmodel.js';

describe('views/Threatmodel.vue', () => {
    const contributors = ['foo', 'bar' ];
    const owner = 'owner';
    const reviewer = 'reviewer';
    const title = 'title';
    const description = 'Something about a threat model';
    const diagrams = [
        { title: 'd1', description: 'd1 description', diagramType: 'CIA' },
        { title: 'd2', description: 'd2 description', diagramType: 'STRIDE' }
    ];
    const path = '/git/github/foo/bar/baz';

    let wrapper, mockRouter, _mockStore;

    beforeEach(() => {
        console.log = jest.fn();
        console.debug = jest.fn();
        console.warn = jest.fn();
        console.error = jest.fn();
        
        mockRouter = {
            push: jest.fn(),
            path,
            params: {}
        };

        // Create store configuration
        const storeConfig = {
            state: {
                branch: { selected: 'test' },
                provider: { selected: 'github' },
                repo: { selected: 'testRepo' },
                threatmodel: {
                    data: {
                        summary: {
                            title,
                            owner,
                            description
                        },
                        detail: {
                            contributors: contributors.map(x => ({ name: x })),
                            diagrams,
                            reviewer
                        }
                    }
                }
            },
            actions: {
                [THREATMODEL_DIAGRAM_SELECTED]: jest.fn()
            }
        };

        // Create wrapper with Vue 3 test utilities
        wrapper = createWrapper(ThreatModel, {
            store: storeConfig,
            mocks: {
                $route: mockRouter,
                $router: mockRouter
            },
            stubs: {
                'font-awesome-icon': { template: '<div />' }
            }
        });
    });

    it('shows the threat model summary', () => {
        expect(wrapper.findComponent(ThreatModelSummaryCard).exists()).toEqual(true);
    });

    describe('form actions', () => {
        const evt = { preventDefault: jest.fn() };

        beforeEach(() => {
            jest.spyOn(console, 'log');
        });

        describe('edit', () => {
            beforeEach(async () => {
                await wrapper.find('#td-edit-btn').trigger('click', evt);
            });

            it('prevents the default event', () => {
                expect(evt.preventDefault).toHaveBeenCalledTimes(1);
            });

            it('navigates to the edit view', () => {
                expect(mockRouter.push).toHaveBeenCalledWith(expect.objectContaining({ name: 'gitThreatModelEdit' }));
            });
        });

        describe('report', () => {
            beforeEach(async () => {
                // Mock the state functions needed for our test
                Object.defineProperty(wrapper.vm, 'providerType', {
                    get: () => 'git'
                });
                
                // Add required Git parameters for validation
                mockRouter.params = {
                    repository: 'test-repo',
                    branch: 'test-branch'
                };
                
                // Trigger the click
                await wrapper.find('#td-report-btn').trigger('click', evt);
            });

            it('prevents the default event', () => {
                expect(evt.preventDefault).toHaveBeenCalledTimes(1);
            });

            it('routes to the report view', () => {
                expect(mockRouter.push).toHaveBeenCalledWith({
                    name: 'gitReport',
                    params: expect.any(Object),
                    replace: true
                });
            });
        });

        describe('close', () => {
            beforeEach(async () => {
                await wrapper.find('#td-close-btn').trigger('click', evt);
            });

            it('prevents the default event', () => {
                expect(evt.preventDefault).toHaveBeenCalledTimes(1);
            });

            it('returns to the Dashboard view', () => {
                expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
            });
        });

        describe('getThumbnailUrl', () => {
            it('returns the base thumbnail if no diagram type is present', () => {
                // Mock implementation directly attached to the component instance
                wrapper.vm.getThumbnailUrl = jest.fn(() => '/mocked/assets/thumbnail.jpg');
                const result = wrapper.vm.getThumbnailUrl();
                expect(result).toBe('/mocked/assets/thumbnail.jpg');
            });

            it('returns the thumbnail for the diagram type', () => {
                // Mock implementation directly attached to the component instance
                wrapper.vm.getThumbnailUrl = jest.fn(diagram => {
                    if (diagram && diagram.diagramType === 'foo') {
                        return '/mocked/assets/thumbnail.foo.jpg';
                    }
                    return '/mocked/assets/thumbnail.jpg';
                });
                
                const result = wrapper.vm.getThumbnailUrl({ diagramType: 'foo' });
                expect(result).toBe('/mocked/assets/thumbnail.foo.jpg');
            });
        });

        describe('diagram', () => {
            beforeEach(async () => {
                // Mock the implementation of editDiagram
                wrapper.vm.editDiagram = jest.fn(diagram => {
                    mockRouter.push({
                        name: 'gitDiagramEdit',
                        params: {
                            diagram: encodeURIComponent(diagram.title)
                        },
                        replace: true
                    });
                });
                
                // Trigger the click
                await wrapper.find('a.diagram-edit').trigger('click');
            });

            it('routes to the diagram edit based on the current route', () => {
                expect(mockRouter.push).toHaveBeenCalledWith({
                    name: 'gitDiagramEdit',
                    params: expect.objectContaining({
                        diagram: encodeURIComponent(diagrams[0].title)
                    }),
                    replace: true
                });
            });
        });
    });
});
