import { BButton, BFormInput, BFormTextarea, BootstrapVue } from 'bootstrap-vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

import dataChanged from '@/service/x6/graph/data-changed.js';
import threatModels from '@/service/threats/models/index.js';
import { GetContextSuggestions } from '@/service/threats/oats/context-generator.js';
import TdFormRadioGroup from '@/components/FormRadioGroup.vue';
import TdFormSelect from '@/components/FormSelect.vue';
import TdThreatStatusSelector from '@/components/ThreatStatusSelector.vue';
import TdThreatSuggestDialog from '@/components/ThreatSuggestDialog.vue';

jest.mock('@/service/threats/oats/context-generator.js', () => ({
    GetContextSuggestions: jest.fn()
}));

describe('components/ThreatSuggestDialog.vue', () => {
    let localVue, mockStore, wrapper;

    const getStore = () => new Vuex.Store({
        state: {
            cell: { ref: { data: { type: 'tm.Process', threats: [] } } },
            threatmodel: {
                selectedDiagram: { diagramType: 'STRIDE' },
                data: { detail: { threatTop: 0 } }
            }
        },
        actions: { CELL_DATA_UPDATED: () => {} }
    });

    const getWrapper = () => {
        mockStore = getStore();
        wrapper = shallowMount(TdThreatSuggestDialog, {
            localVue,
            mocks: { $t: key => key },
            store: mockStore
        });
        jest.spyOn(wrapper.vm.$refs.editModal, 'show').mockImplementation(() => {});
        jest.spyOn(wrapper.vm.$refs.editModal, 'hide').mockImplementation(() => {});
        return wrapper;
    };

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(Vuex);
        localVue.use(BootstrapVue);
        GetContextSuggestions.mockReset();
        wrapper = getWrapper();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('renders the threat status selector', () => {
        const selector = wrapper.findAllComponents(TdThreatStatusSelector)
            .filter(x => x.attributes('id') === 'status')
            .at(0);

        expect(selector.exists()).toEqual(true);
    });

    it('updates fields from the form controls', () => {
        const inputs = wrapper.findAllComponents(BFormInput);
        inputs.at(0).vm.$emit('input', 'title');
        inputs.at(1).vm.$emit('input', 'score');
        wrapper.findComponent(TdFormSelect).vm.$emit('input', 'type');
        wrapper.findComponent(TdThreatStatusSelector).vm.$emit('input', 'Accepted');
        wrapper.findComponent(TdFormRadioGroup).vm.$emit('input', 'High');
        const textareas = wrapper.findAllComponents(BFormTextarea);
        textareas.at(0).vm.$emit('input', 'description');
        textareas.at(1).vm.$emit('input', 'mitigation');

        expect(wrapper.vm.threat).toEqual(expect.objectContaining({
            title: 'title',
            score: 'score',
            type: 'type',
            status: 'Accepted',
            severity: 'High',
            description: 'description',
            mitigation: 'mitigation'
        }));
    });

    it('connects the modal footer buttons to dialog actions', async () => {
        const acceptSuggestion = jest.spyOn(wrapper.vm, 'acceptSuggestion').mockImplementation(() => {});
        const previous = jest.spyOn(wrapper.vm, 'previous').mockImplementation(() => {});
        const next = jest.spyOn(wrapper.vm, 'next').mockImplementation(() => {});
        const hideModal = jest.spyOn(wrapper.vm, 'hideModal').mockImplementation(() => {});

        const buttons = wrapper.findAllComponents(BButton);
        await buttons.at(0).trigger('click');
        await buttons.at(1).trigger('click');
        await buttons.at(2).trigger('click');
        await buttons.at(3).trigger('click');

        expect([
            acceptSuggestion,
            previous,
            next,
            hideModal
        ].every(method => method.mock.calls.length === 1)).toEqual(true);
    });

    it('lists translated threat types', () => {
        expect(wrapper.vm.threatTypes.length).toBeGreaterThan(0);
    });

    it('returns no threat types without a threat', () => {
        const context = { cellRef: mockStore.state.cell.ref, threat: null, modelType: 'STRIDE' };
        expect(TdThreatSuggestDialog.computed.threatTypes.call(context)).toEqual([]);
    });

    it('returns no threat types without a cell', () => {
        const context = { cellRef: null, threat: {}, modelType: 'STRIDE' };
        expect(TdThreatSuggestDialog.computed.threatTypes.call(context)).toEqual([]);
    });

    it('returns no threat types without a model type', () => {
        const context = { cellRef: mockStore.state.cell.ref, threat: {}, modelType: null };
        expect(TdThreatSuggestDialog.computed.threatTypes.call(context)).toEqual([]);
    });

    it('provides severity priorities', () => {
        expect(wrapper.vm.priorities).toHaveLength(5);
    });

    it('uses the next threat number in the modal title', () => {
        expect(wrapper.vm.modalTitle).toEqual('threats.newThreat #1');
    });

    it('shows suggestions by threat type', () => {
        wrapper.vm.showModal('type');
        expect(wrapper.vm.suggestions).toHaveLength(wrapper.vm.threatTypes.length);
    });

    it('selects the first threat-type suggestion', () => {
        wrapper.vm.showModal('type');
        expect(wrapper.vm.threat).toEqual(wrapper.vm.suggestions[0]);
    });

    it('shows the suggestion modal', () => {
        wrapper.vm.showModal('type');
        expect(wrapper.vm.$refs.editModal.show).toHaveBeenCalled();
    });

    it('shows context suggestions', () => {
        GetContextSuggestions.mockReturnValue([{
            title: 'Context threat',
            type: 'custom.type',
            description: 'description',
            mitigation: 'mitigation'
        }]);

        wrapper.vm.showModal('context');

        expect(wrapper.vm.suggestions[0].title).toEqual('Context threat');
    });

    it('adds a new context suggestion type', () => {
        GetContextSuggestions.mockReturnValue([{
            title: 'Context threat',
            type: 'custom.type',
            description: 'description',
            mitigation: 'mitigation'
        }]);

        wrapper.vm.showModal('context');

        expect(wrapper.vm.types).toContain('custom.type');
    });

    it('does not add an empty context suggestion type', () => {
        GetContextSuggestions.mockReturnValue([{
            title: 'Context threat',
            type: '',
            description: 'description',
            mitigation: 'mitigation'
        }]);

        wrapper.vm.showModal('context');

        expect(wrapper.vm.types).not.toContain('');
    });

    it('does not duplicate an existing context suggestion type', () => {
        const existingType = wrapper.vm.threatTypes[0];
        GetContextSuggestions.mockReturnValue([{
            title: 'Context threat',
            type: existingType,
            description: 'description',
            mitigation: 'mitigation'
        }]);

        wrapper.vm.showModal('context');

        expect(wrapper.vm.types.filter(type => type === existingType)).toHaveLength(1);
    });

    it('clears the dialog state when hiding', () => {
        wrapper.vm.suggestions = [{ title: 'threat' }];
        wrapper.vm.types = ['type'];
        wrapper.vm.index = 2;
        wrapper.vm.hideModal();
        expect(wrapper.vm.suggestions).toEqual([]);
    });

    it('hides the modal', () => {
        wrapper.vm.hideModal();
        expect(wrapper.vm.$refs.editModal.hide).toHaveBeenCalled();
    });

    it('advances to the next suggestion', () => {
        wrapper.vm.suggestions = [{ title: 'one' }, { title: 'two' }];
        wrapper.vm.threat = wrapper.vm.suggestions[0];
        wrapper.vm.next();
        expect(wrapper.vm.threat.title).toEqual('two');
    });

    it('hides after the final suggestion', () => {
        wrapper.vm.suggestions = [{ title: 'one' }];
        wrapper.vm.next();
        expect(wrapper.vm.$refs.editModal.hide).toHaveBeenCalled();
    });

    it('returns to the previous suggestion', () => {
        wrapper.vm.suggestions = [{ title: 'one' }, { title: 'two' }];
        wrapper.vm.index = 1;
        wrapper.vm.previous();
        expect(wrapper.vm.threat.title).toEqual('one');
    });

    it('stays on the first suggestion', () => {
        wrapper.vm.suggestions = [{ title: 'one' }];
        wrapper.vm.previous();
        expect(wrapper.vm.index).toEqual(0);
    });

    it('accepts a suggestion', () => {
        mockStore.dispatch = jest.fn();
        dataChanged.updateStyleAttrs = jest.fn();
        wrapper.vm.threat = {
            type: wrapper.vm.threatTypes[0],
            modelType: 'STRIDE',
            status: 'Open'
        };
        wrapper.vm.suggestions = [wrapper.vm.threat, { title: 'next' }];

        wrapper.vm.acceptSuggestion();

        expect(mockStore.state.cell.ref.data.threats).toHaveLength(1);
    });

    it('creates a threat frequency map when accepting a suggestion', () => {
        mockStore.dispatch = jest.fn();
        dataChanged.updateStyleAttrs = jest.fn();
        wrapper.vm.threat = {
            type: wrapper.vm.threatTypes[0],
            modelType: 'STRIDE',
            status: 'Open'
        };
        wrapper.vm.suggestions = [wrapper.vm.threat, { title: 'next' }];

        wrapper.vm.acceptSuggestion();

        expect(mockStore.state.cell.ref.data.threatFrequency).toBeDefined();
    });

    it('keeps a missing frequency map when the model has none', () => {
        jest.spyOn(threatModels, 'getFrequencyMapByElement').mockReturnValue(null);
        mockStore.dispatch = jest.fn();
        dataChanged.updateStyleAttrs = jest.fn();
        wrapper.vm.threat = {
            type: 'custom',
            modelType: 'custom',
            status: 'Open'
        };
        wrapper.vm.suggestions = [wrapper.vm.threat, { title: 'next' }];

        wrapper.vm.acceptSuggestion();

        expect(mockStore.state.cell.ref.data.threatFrequency).toBeUndefined();
    });

    it('increments an existing matching frequency', () => {
        mockStore.state.cell.ref.data.threatFrequency = { spoofing: 0, tampering: 0 };
        mockStore.dispatch = jest.fn();
        dataChanged.updateStyleAttrs = jest.fn();
        wrapper.vm.threat = {
            type: 'threats.model.stride.spoofing',
            modelType: 'STRIDE',
            status: 'Open'
        };
        wrapper.vm.suggestions = [wrapper.vm.threat, { title: 'next' }];

        wrapper.vm.acceptSuggestion();

        expect(mockStore.state.cell.ref.data.threatFrequency.spoofing).toEqual(1);
    });

    it('marks the cell as having open threats', () => {
        mockStore.dispatch = jest.fn();
        dataChanged.updateStyleAttrs = jest.fn();
        wrapper.vm.threat = {
            type: wrapper.vm.threatTypes[0],
            modelType: 'STRIDE',
            status: 'Open'
        };
        wrapper.vm.suggestions = [wrapper.vm.threat, { title: 'next' }];

        wrapper.vm.acceptSuggestion();

        expect(mockStore.state.cell.ref.data.hasOpenThreats).toEqual(true);
    });

    it('dispatches updates when accepting a suggestion', () => {
        mockStore.dispatch = jest.fn();
        dataChanged.updateStyleAttrs = jest.fn();
        wrapper.vm.threat = {
            type: wrapper.vm.threatTypes[0],
            modelType: 'STRIDE',
            status: 'Open'
        };
        wrapper.vm.suggestions = [wrapper.vm.threat, { title: 'next' }];

        wrapper.vm.acceptSuggestion();

        expect(mockStore.dispatch).toHaveBeenCalledTimes(3);
    });

    it('updates graph styles when accepting a suggestion', () => {
        mockStore.dispatch = jest.fn();
        dataChanged.updateStyleAttrs = jest.fn();
        wrapper.vm.threat = {
            type: wrapper.vm.threatTypes[0],
            modelType: 'STRIDE',
            status: 'Open'
        };
        wrapper.vm.suggestions = [wrapper.vm.threat, { title: 'next' }];

        wrapper.vm.acceptSuggestion();

        expect(dataChanged.updateStyleAttrs).toHaveBeenCalledWith(mockStore.state.cell.ref);
    });
});
