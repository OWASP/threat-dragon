import { BootstrapVue, BCard } from 'bootstrap-vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

import router from '@/router/index.js';
import ThreatModel from '@/views/Threatmodel.vue';

describe('views/Threatmodel.vue', () => {
    const contributors = [{ name: 'foo' }, { name: 'bar' }];
    const owner = 'owner';
    const reviewer = 'reviewer';
    const title = 'title';
    const description = 'Something about a threat model';
    const diagrams = [
        { title: 'd1', diagramType: 'CIA' },
        { title: 'd2', diagramType: 'STRIDE' }
    ];

    let wrapper, localVue, mockStore;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(BootstrapVue);
        localVue.use(Vuex);
        mockStore = new Vuex.Store({
            state: {
                threatmodel: {
                    data: {
                        contributors,
                        reviewer,
                        diagrams,
                        owner,
                        title,
                        description
                    }
                }
            }
        });
        router.push = jest.fn();

        wrapper = shallowMount(ThreatModel, {
            localVue,
            store: mockStore,
            stubs: {
                'router-link': { template: '<div />' },
                'font-awesome-icon': { template: '<div />' }
            }
        });
    });

    describe('layout', () => {
        it('displays the title', () => {
            const card = wrapper.find('#title_row').findComponent(BCard);
            expect(card.attributes('header')).toEqual(title);
        });

        it('shows the owner', () => {
            expect(wrapper.find('#tm_owner').text()).toEqual(owner);
        });

        it('shows the reviewer', () => {
            expect(wrapper.find('#tm_reviewer').text()).toEqual(reviewer);
        });

        it('shows the contributors', () => {
            const expected = contributors.map(x => x.name).join(', ');
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
            beforeEach(() => {
                ThreatModel.methods.onEditClick(evt);
            });

            it('prevents the default event', () => {
                expect(evt.preventDefault).toHaveBeenCalledTimes(1);
            });

            it('navigates to the edit view', () => {
                expect(router.push).toHaveBeenCalledWith('/threatmodel-edit');
            });
        });

        describe('report', () => {
            beforeEach(() => {
                ThreatModel.methods.onReportClick(evt);
            });

            it('prevents the default event', () => {
                expect(evt.preventDefault).toHaveBeenCalledTimes(1);
            });

            it('logs to the console and needs to be removed...', () => {
                expect(console.log).toHaveBeenCalled();
            });
        });

        describe('delete', () => {
            beforeEach(() => {
                ThreatModel.methods.onDeleteClick(evt);
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
    });
});
