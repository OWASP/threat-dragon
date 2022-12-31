import { BootstrapVue } from 'bootstrap-vue';
import { createLocalVue, mount } from '@vue/test-utils';
import Vuex from 'vuex';

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

    let wrapper, localVue, mockRouter, mockStore;

    beforeEach(() => {
        console.log = jest.fn();
        localVue = createLocalVue();
        localVue.use(BootstrapVue);
        localVue.use(Vuex);
        mockStore = new Vuex.Store({
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
                            contributors: contributors.map(x =>  ({ name: x })),
                            diagrams,
                            reviewer
                        }
                    }
                }
            },
            actions: {
                [THREATMODEL_DIAGRAM_SELECTED]: () => { }
            }
        });

        mockRouter = {
            push: jest.fn(),
            path
        };

        wrapper = mount(ThreatModel, {
            localVue,
            store: mockStore,
            stubs: {
                'font-awesome-icon': { template: '<div />' }
            },
            mocks: {
                $t: key => key,
                $route: mockRouter,
                $router: mockRouter
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
                await wrapper.find('#td-report-btn').trigger('click', evt);
            });

            it('prevents the default event', () => {
                expect(evt.preventDefault).toHaveBeenCalledTimes(1);
            });

            it('routes to the report view', () => {
                expect(mockRouter.push).toHaveBeenCalledWith({ name: 'gitReport', params: mockRouter.params});
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
            const base = '../assets/thumbnail';

            it('returns the base thumbnail if no diagram type is present', () => {
                expect(ThreatModel.methods.getThumbnailUrl()).toEqual(`${base}.jpg`);
            });

            it('returns the thumbnail for the diagram type', () => {
                expect(ThreatModel.methods.getThumbnailUrl({ diagramType: 'foo' })).toEqual(`${base}.foo.jpg`);
            });
        });

        describe('diagram', () => {
            beforeEach(async () => {
                await wrapper.find('a.diagram-edit').trigger('click');
            });

            it('routes to the diagram edit based on the current route', () => {
                expect(mockRouter.push).toHaveBeenCalledWith(`${path}/edit/${encodeURIComponent(diagrams[0].title)}`);
            });
        });
    });
});
