import { BootstrapVue, BCard } from 'bootstrap-vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

import TdFormButton from '@/components/FormButton.vue';
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
                        detail: {
                            contributors,
                            reviewer,
                            diagrams
                        },
                        summary: {
                            owner,
                            title,
                            description
                        }
                    }
                }
            }
        });

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

    xdescribe('form actions', () => {
        beforeEach(() => {
            jest.spyOn(console, 'log');
        });

        describe('edit', () => {
            let editBtn;

            beforeEach(() => {
                editBtn = wrapper.findAllComponents(TdFormButton)
                    .filter(x => x.attributes('text') === 'Edit')
                    .at(0);
            });

            it('uses the edit icon', () => {
                expect(editBtn.attributes('icon')).toEqual('edit');
            });

            it('calls console.log and needs to be updated', async () => {
                await editBtn.trigger('click');
                expect(console.log).toHaveBeenCalled();
            });
        });

        describe('report', () => {
            let reportBtn;

            beforeEach(() => {
                reportBtn = wrapper.findAllComponents(TdFormButton)
                    .filter(x => x.attributes('text') === 'Report')
                    .at(0);
            });

            it('uses the file-alt icon', () => {
                expect(reportBtn.attributes('icon')).toEqual('file-alt');
            });

            it('calls console.log and needs to be updated', async () => {
                await reportBtn.trigger('click');
                // write test
            });
        });

        describe('delete', () => {
            let deleteBtn;

            beforeEach(() => {
                deleteBtn = wrapper.findAllComponents(TdFormButton)
                    .filter(x => x.attributes('text') === 'Delete')
                    .at(0);
            });

            it('uses the times icon', () => {
                expect(deleteBtn.attributes('icon')).toEqual('times');
            });

            it('calls console.log and needs to be updated', async () => {
                await deleteBtn.trigger('click');
                // write test
            });
        });
    });
});
