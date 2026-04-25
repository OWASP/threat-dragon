import { BFormInput, BFormTextarea, BModal, createBootstrap } from 'bootstrap-vue-next';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

import dataChanged from '@/service/x6/graph/data-changed.js';
import TdFormRadioGroup from '@/components/FormRadioGroup.vue';
import TdFormSelect from '@/components/FormSelect.vue';
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
        state: {
            cell: {
                ref: {
                    getData: jest.fn(),
                    data: {
                        threatFrequency: {
                            availability: 0,
                            confidentiality: 0,
                            integrity: 0
                        },
                        threats: [ getThreatData() ]
                    }
                }
            }
        },
        actions: { CELL_DATA_UPDATED: () => {} }
    });

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(Vuex);
        localVue.use(createBootstrap());
    });

    const BModalStub = {
        name: 'BModal',
        props: ['title', 'modelValue'],
        template: '<div><slot /><slot name="footer" /></div>'
    };

    const getWrapper = () => shallowMount(TdThreatEditDialog, {
        localVue,
        mocks: {
            $t: key => key
        },
        stubs: {
            BModal: BModalStub
        },
        store: mockStore = getStore()
    });

    describe('ui elements', () => {
        let modal;

        beforeEach(() => {
            wrapper = getWrapper();
            modal = wrapper.findComponent(BModal);
            wrapper.vm.editThreat(getThreatData().id);
        });

        it('has a bootstrap modal', () => {
            expect(modal.exists()).toBe(true);
        });

        it('uses threat edit as a title', () => {
            expect(modal.attributes('title')).toEqual('threats.edit #0');
        });

        it('shows the modal', () => {
            expect(wrapper.vm.editModalVisible).toBe(true);
        });

        it('hides the modal', () => {
            wrapper.vm.hideModal();
            expect(wrapper.vm.editModalVisible).toBe(false);
        });

        it('has a title input', () => {
            const input = wrapper.findAllComponents(BFormInput)
                .filter(x => x.attributes('id') === 'title')
                .at(0);

            expect(input.exists()).toEqual(true);
        });

        it('has a threat type input', () => {
            const input = wrapper.findAllComponents(TdFormSelect)
                .filter(x => x.attributes('id') === 'threat-type')
                .at(0);

            expect(input.exists()).toEqual(true);
        });

        it('has a status input', () => {
            const input = wrapper.findAllComponents(TdFormRadioGroup)
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
            const input = wrapper.findAllComponents(TdFormRadioGroup)
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
                const modal = Promise.resolve({ ok: false });
                modal.destroy = jest.fn().mockResolvedValue();
                wrapper.vm.modalController.create = jest.fn().mockReturnValue(modal);
                await wrapper.vm.confirmDelete();
            });

            it('does not delete the threat', () => {
                expect(wrapper.vm.hideModal).not.toHaveBeenCalled();
            });
        });

        describe('with confirmation', () => {
            beforeEach(async () => {
                const modal = Promise.resolve({ ok: true });
                modal.destroy = jest.fn().mockResolvedValue();
                wrapper.vm.modalController.create = jest.fn().mockReturnValue(modal);
                dataChanged.updateStyleAttrs = jest.fn();
                mockStore.dispatch = jest.fn();
                await wrapper.vm.editThreat(threatId);
                await wrapper.vm.confirmDelete();
            });

            it('dispatches the cell data updated action', () => {
                expect(mockStore.dispatch)
                    .toHaveBeenCalledWith('CELL_DATA_UPDATED', {
                        hasOpenThreats: false,
                        threatFrequency: {
                            availability: 0,
                            confidentiality: 0,
                            integrity: 0
                        },
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
            mockStore.dispatch = jest.fn();
            dataChanged.updateStyleAttrs = jest.fn();
            wrapper.vm.editThreat(threatId);
            wrapper.vm.updateThreat();
        });

        it('updates the data', () => {
            expect(mockStore.dispatch)
                .toHaveBeenNthCalledWith(1, 'CELL_DATA_UPDATED', {
                    threatFrequency: {
                        availability: 0,
                        confidentiality: 0,
                        integrity: 0
                    },
                    threats: [ getThreatData() ]
                });
            expect(mockStore.dispatch).toHaveBeenNthCalledWith(2, 'THREATMODEL_MODIFIED');
        });

        it('updates the styles', () => {
            expect(dataChanged.updateStyleAttrs).toHaveBeenCalledTimes(1);
        });
    });

    describe('cornucopia link', () => {
        it('renders link for EOP with suit and number', async () => {
            const store = new Vuex.Store({
                state: {
                    cell: {
                        ref: {
                            getData: jest.fn(),
                            data: {
                                threatFrequency: {
                                    availability: 0,
                                    confidentiality: 0,
                                    integrity: 0
                                },
                                threats: [{ ...getThreatData(), modelType: 'EOP' }]
                            }
                        }
                    }
                },
                actions: { CELL_DATA_UPDATED: () => {} }
            });

            wrapper = shallowMount(TdThreatEditDialog, {
                localVue,
                mocks: { $t: k => k },
                stubs: { BModal: BModalStub },
                store
            });
            wrapper.vm.editThreat(threatId);
            wrapper.vm.selectedGameId = 'cornucopia';
            wrapper.vm.card.suit = 'DATA VALIDATION & ENCODING';
            wrapper.vm.card.number = 'VE2';
            await wrapper.vm.$nextTick();
            const link = wrapper.find('a');
            expect(link.exists()).toBe(true);
            expect(link.attributes('href')).toContain('https://cornucopia.owasp.org/edition/webapp/');
            expect(link.text()).toContain('VE2');
        });

        it('hides link when model is not EOP', () => {
            const store = new Vuex.Store({
                state: {
                    cell: {
                        ref: {
                            getData: jest.fn(),
                            data: {
                                threatFrequency: {
                                    availability: 0,
                                    confidentiality: 0,
                                    integrity: 0
                                },
                                threats: [ getThreatData() ]
                            }
                        }
                    }
                },
                actions: { CELL_DATA_UPDATED: () => {} }
            });

            wrapper = shallowMount(TdThreatEditDialog, {
                localVue,
                mocks: { $t: key => key },
                stubs: { BModal: BModalStub },
                store
            });
            wrapper.vm.editThreat(threatId);
            const link = wrapper.find('a');
            expect(link.exists()).toBe(false);
        });

        it('modal title uses threat number', () => {
            wrapper = getWrapper();
            wrapper.vm.editThreat(threatId);
            expect(wrapper.vm.modalTitle).toBe('threats.edit #0');
        });

        it('returns empty threatTypes when no threat', () => {
            wrapper = getWrapper();
            wrapper.vm.threat = null;
            expect(wrapper.vm.threatTypes).toEqual([]);
        });
    });

    describe('cornucopia selects', () => {
        describe('when modelType is EOP', () => {
            beforeEach(() => {
                wrapper = getWrapper();

                const cornucopiaThreat = getThreatData();
                cornucopiaThreat.modelType = 'EOP';
                mockStore.state.cell.ref.data.threats = [cornucopiaThreat];

                wrapper.vm.editThreat(threatId);
            });

            it('has an eop game input', () => {
                const input = wrapper.findAllComponents(TdFormSelect)
                    .filter(x => x.attributes('id') === 'eop-game-select')
                    .at(0);

                expect(input.exists()).toBe(true);
            });


            it('has a card suit input', () => {
                const input = wrapper.findAllComponents(TdFormSelect)
                    .filter(x => x.attributes('id') === 'card-suit')
                    .at(0);

                expect(input.exists()).toBe(true);
            });

            it('has a card number input', () => {
                const input = wrapper.findAllComponents(TdFormSelect)
                    .filter(x => x.attributes('id') === 'card-number')
                    .at(0);

                expect(input.exists()).toBe(true);
            });

            it('does not show a threat type input', () => {
                const inputs = wrapper.findAllComponents(TdFormSelect)
                    .filter(x => x.attributes('id') === 'threat-type');

                expect(inputs).toHaveLength(0);
            });
        });

        describe('when modelType is not EOP', () => {
            beforeEach(() => {
                wrapper = getWrapper();
                wrapper.vm.editThreat(threatId);
            });

            it('has a threat type input', () => {
                const input = wrapper.findAllComponents(TdFormSelect)
                    .filter(x => x.attributes('id') === 'threat-type')
                    .at(0);

                expect(input.exists()).toEqual(true);
            });

            it('does not show card suit input', () => {
                const inputs = wrapper.findAllComponents(TdFormSelect)
                    .filter(x => x.attributes('id') === 'card-suit');

                expect(inputs).toHaveLength(0);
            });

            it('does not show card number input', () => {
                const inputs = wrapper.findAllComponents(TdFormSelect)
                    .filter(x => x.attributes('id') === 'card-number');

                expect(inputs).toHaveLength(0);
            });
        });
    });

    describe('updateThreat card validation', () => {
        beforeEach(() => {
            wrapper = getWrapper();
            mockStore.dispatch = jest.fn();
            dataChanged.updateStyleAttrs = jest.fn();
        });
        describe('when modelType is EOP and card suit is selected but card number is not', () => {
            beforeEach(async () => {
                const eopThreat = getThreatData();
                eopThreat.modelType = 'EOP';
                mockStore.state.cell.ref.data.threats = [eopThreat];

                wrapper.vm.editThreat(threatId);
                wrapper.vm.card.suit = 'DATA VALIDATION & ENCODING';
                wrapper.vm.card.number = null;
                const modal = Promise.resolve({ ok: true });
                modal.destroy = jest.fn().mockResolvedValue();
                wrapper.vm.modalController.create = jest.fn().mockReturnValue(modal);

                await wrapper.vm.updateThreat();
            });

            it('shows error modal', () => {
                expect(wrapper.vm.modalController.create).toHaveBeenCalledWith(
                    expect.objectContaining({
                        body: 'threats.validation.cardNumberRequired',
                        title: 'threats.validation.error',
                        okVariant: 'danger',
                        okOnly: true,
                        headerBgVariant: 'danger',
                        headerTextVariant: 'light',
                        centered: true
                    }),
                    { resolveOnHide: true }
                );
            });

            it('does not update the threat', () => {
                expect(mockStore.dispatch).not.toHaveBeenCalled();
            });

            it('does not hide the modal', () => {
                expect(wrapper.vm.editModalVisible).toBe(true);
            });

            it('does not update style attributes', () => {
                expect(dataChanged.updateStyleAttrs).not.toHaveBeenCalled();
            });
        });

        describe('when modelType is EOP and both card suit and number are selected', () => {
            beforeEach(() => {
                const eopThreat = getThreatData();
                eopThreat.modelType = 'EOP';
                mockStore.state.cell.ref.data.threats = [eopThreat];

                wrapper.vm.editThreat(threatId);
                wrapper.vm.card.suit = 'DATA VALIDATION & ENCODING';
                wrapper.vm.card.number = 'VE2';
                wrapper.vm.updateThreat();
            });

            it('updates the threat successfully', () => {
                expect(mockStore.dispatch).toHaveBeenCalled();
            });

            it('hides the modal', () => {
                expect(wrapper.vm.editModalVisible).toBe(false);
            });

            it('updates the style attributes', () => {
                expect(dataChanged.updateStyleAttrs).toHaveBeenCalled();
            });
        });
    });
});
