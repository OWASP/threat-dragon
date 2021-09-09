import { BootstrapVue } from 'bootstrap-vue';
import { createLocalVue, mount } from '@vue/test-utils';
import Vuex from 'vuex';

import ThreatModel from '@/views/ThreatModel.vue';
import { THREATMODEL_DIAGRAM_SELECTED } from '@/store/actions/threatmodel.js';

describe('views/Threatmodel.vue', () => {
    const contributors = ['foo', 'bar' ];
    const owner = 'owner';
    const reviewer = 'reviewer';
    const title = 'title';
    const description = 'Something about a threat model';
    const diagrams = [
        { title: 'd1', diagramType: 'CIA' },
        { title: 'd2', diagramType: 'STRIDE' }
    ];
    const path = '/git/github/foo/bar/baz';

    let wrapper, localVue, mockRouter, mockStore;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(BootstrapVue);
        localVue.use(Vuex);
        mockStore = new Vuex.Store({
            state: {
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
                $route: mockRouter,
                $router: mockRouter
            }
        });
    });

    describe('layout', () => {
        it('displays the title', () => {
            const header = wrapper.findComponent({ ref: 'header-card'}).find('.card-header');
            expect(header.text()).toEqual(title);
        });

        it('shows the owner', () => {
            expect(wrapper.find('#tm_owner').text()).toEqual(owner);
        });

        it('shows the reviewer', () => {
            expect(wrapper.find('#tm_reviewer').text()).toEqual(reviewer);
        });

        it('shows the contributors', () => {
            const expected = contributors.join(', ');
            expect(wrapper.find('#tm_contributors').text()).toEqual(expected);
        });

        it('shows the description', () => {
            expect(wrapper.find('#tm_description').text()).toEqual(description);
        });

        it('displays all diagrams', () => {
            expect(wrapper.findAll('.tm_diagram').length).toEqual(diagrams.length);
        });
    });

    describe('form actions', () => {
        const evt = { preventDefault: jest.fn() };

        beforeEach(() => {
            jest.spyOn(console, 'log');
        });

        describe('edit', () => {
            beforeEach(async () => {
                await wrapper.find('#tm-edit-btn').trigger('click', evt);
            });

            it('prevents the default event', () => {
                expect(evt.preventDefault).toHaveBeenCalledTimes(1);
            });

            xit('navigates to the edit view', () => {
                expect(mockRouter.push).toHaveBeenCalledTimes(1);
                // expect(mockRouter.push).toHaveBeenCalledWith('ThreatModelEdit', expect.anything());
            });
        });

        describe('report', () => {
            beforeEach(async () => {
                await wrapper.find('#tm-report-btn').trigger('click', evt);
            });

            it('prevents the default event', () => {
                expect(evt.preventDefault).toHaveBeenCalledTimes(1);
            });

            it('logs to the console and needs to be removed...', () => {
                expect(console.log).toHaveBeenCalled();
            });
        });

        describe('delete', () => {
            beforeEach(async () => {
                await wrapper.find('#tm-delete-btn').trigger('click', evt);
            });

            it('prevents the default event', () => {
                expect(evt.preventDefault).toHaveBeenCalledTimes(1);
            });

            it('logs to the console and needs to be removed...', () => {
                expect(console.log).toHaveBeenCalled();
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
