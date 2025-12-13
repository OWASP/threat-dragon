import { BFormInput, BFormRadioGroup, BFormSelect, BFormTextarea, BModal, BootstrapVue } from 'bootstrap-vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

import dataChanged from '@/service/x6/graph/data-changed.js';
import TdThreatEditDialog from '@/components/ThreatEditDialog.vue';

describe('components/ThreatEditDialog.vue', () => {
    let localVue, mockStore, wrapper;
    const threatId = 'asdf-asdf-asdf-asdf';

    const getThreatData = () => ({
        status: 'Open',
        severity: 'High',
        description: 'Some description',
        title: 'My terrifying threat',
        type: 'Information Disclosure',
        mitigation: 'we will mitigate it eventually',
        modelType: 'CIA',
        new: false,
        number: 0,
        score: '',
        id: threatId
    });

    const getStore = () => new Vuex.Store({
        state: { cell: { ref: { getData: jest.fn(), data: { threatFrequency:{availability: 0,confidentiality: 0,integrity: 0}, threats: [ getThreatData() ]}}}},
        actions: { CELL_DATA_UPDATED: () => {} }
    });

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(Vuex);
        localVue.use(BootstrapVue);
    });

    const getWrapper = () => shallowMount(TdThreatEditDialog, {
        localVue,
        mocks: {
            $t: key => key
        },
        store: mockStore = getStore()
    });

    describe('ui elements', () => {
        let modal;

        beforeEach(() => {
            wrapper = getWrapper();
            modal = wrapper.findComponent(BModal);
            wrapper.vm.$refs.editModal.show = jest.fn();
            wrapper.vm.$refs.editModal.hide = jest.fn();
            wrapper.vm.editThreat(getThreatData().id);
        });

        it('has a bootstrap modal', () => {
            expect(modal.exists()).toBe(true);
        });

        it('uses threat edit as a title', () => {
            expect(modal.attributes('title')).toEqual('threats.edit #0');
        });

        it('shows the modal', () => {
            expect(wrapper.vm.$refs.editModal.show).toHaveBeenCalled();
        });

        it('hides the modal', () => {
            wrapper.vm.hideModal();
            expect(wrapper.vm.$refs.editModal.hide).toHaveBeenCalled();
        });

        it('has a title input', () => {
            const input = wrapper.findAllComponents(BFormInput)
                .filter(x => x.attributes('id') === 'title')
                .at(0);

            expect(input.exists()).toEqual(true);
        });

        it('has a threat type input', () => {
            const input = wrapper.findAllComponents(BFormSelect)
                .filter(x => x.attributes('id') === 'threat-type')
                .at(0);

            expect(input.exists()).toEqual(true);
        });

        it('has a status input', () => {
            const input = wrapper.findAllComponents(BFormRadioGroup)
                .filter(x => x.attributes('id') === 'status')
                .at(0);

            expect(input.exists()).toEqual(true);
        });

        it('has a score input', () => {
            const input = wrapper.findAllComponents(BFormInput)
                .filter(x => x.attributes('id') === 'score')
                .at(0);

            expect(input.exists()).toEqual(true);
        });

        it('has a severity input', () => {
            const input = wrapper.findAllComponents(BFormRadioGroup)
                .filter(x => x.attributes('id') === 'severity')
                .at(0);

            expect(input.exists()).toEqual(true);
        });

        it('has a description input', () => {
            const input = wrapper.findAllComponents(BFormTextarea)
                .filter(x => x.attributes('id') === 'description')
                .at(0);

            expect(input.exists()).toEqual(true);
        });

        it('has a mitigations input', () => {
            const input = wrapper.findAllComponents(BFormTextarea)
                .filter(x => x.attributes('id') === 'mitigation')
                .at(0);

            expect(input.exists()).toEqual(true);
        });
    });

    describe('confirmDelete', () => {
        beforeEach(() => {
            wrapper = getWrapper();
            wrapper.vm.hideModal = jest.fn();
        });

        describe('canceled', () => {
            beforeEach(async () => {
                wrapper.vm.$bvModal.msgBoxConfirm = jest.fn().mockResolvedValue(false);
                await wrapper.vm.confirmDelete();
            });

            it('does not delete the threat', () => {
                expect(wrapper.vm.hideModal).not.toHaveBeenCalled();
            });
        });

        describe('with confirmation', () => {
            beforeEach(async () => {
                wrapper.vm.$bvModal.msgBoxConfirm = jest.fn().mockResolvedValue(true);
                dataChanged.updateStyleAttrs = jest.fn();
                mockStore.dispatch = jest.fn();
                wrapper.vm.$refs.editModal.show = jest.fn();
                await wrapper.vm.editThreat(threatId);
                await wrapper.vm.confirmDelete();
            }); 

            it('dispatches the cell data updated action', () => {
                expect(mockStore.dispatch)
                    .toHaveBeenCalledWith('CELL_DATA_UPDATED', {
                        hasOpenThreats: false,
                        threatFrequency:{availability: 0,confidentiality: 0,integrity: 0},
                        threats: []
                    });
            });

            it('updates the style attributes', () => {
                expect(dataChanged.updateStyleAttrs).toHaveBeenCalled();
            });

            it('hides the modal', () => {
                expect(wrapper.vm.hideModal).toHaveBeenCalled();
            });
        });
    });

    describe('updateThreat', () => {
        beforeEach(() => {
            wrapper = getWrapper();
            wrapper.vm.$refs.editModal.show = jest.fn();
            wrapper.vm.$refs.editModal.hide = jest.fn();
            mockStore.dispatch = jest.fn();
            dataChanged.updateStyleAttrs = jest.fn();
            wrapper.vm.editThreat(threatId);
            wrapper.vm.updateThreat();
        });

        it('updates the data', () => {
            expect(mockStore.dispatch).toHaveBeenNthCalledWith(1,'CELL_DATA_UPDATED',{threatFrequency:{availability: 0,confidentiality: 0,integrity: 0}, threats: [ getThreatData() ] });
            expect(mockStore.dispatch).toHaveBeenNthCalledWith(2,'THREATMODEL_MODIFIED;');
        });

        it('updates the styles', () => {
            expect(dataChanged.updateStyleAttrs).toHaveBeenCalledTimes(1);
        });
    });
});
