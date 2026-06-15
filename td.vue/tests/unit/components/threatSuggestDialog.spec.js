import { BootstrapVue } from 'bootstrap-vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

import TdThreatSuggest from '@/components/ThreatSuggestDialog.vue';

describe('components/ThreatSuggestDialog.vue', () => {
    let localVue, wrapper;

    const getWrapper = (cellData) => {
        const store = new Vuex.Store({
            state: {
                cell: { ref: { data: cellData } },
                threatmodel: {
                    selectedDiagram: { diagramType: 'STRIDE' },
                    data: { detail: { threatTop: 0 } }
                }
            }
        });

        return shallowMount(TdThreatSuggest, {
            localVue,
            mocks: { $t: key => key },
            store
        });
    };

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(Vuex);
        localVue.use(BootstrapVue);
    });

    it('adds rule IDs to model type suggestions', () => {
        wrapper = getWrapper({ type: 'tm.Actor', threats: [] });
        wrapper.vm.$refs.editModal.show = jest.fn();

        wrapper.vm.showModal('type');

        expect(wrapper.vm.suggestions[0].ruleId)
            .toEqual('b2a6d40d-d3f8-4750-8e4d-c02cc84b13dc');
    });

    it('adds rule IDs to context suggestions', () => {
        wrapper = getWrapper({
            type: 'tm.Actor',
            providesAuthentication: true,
            threats: []
        });
        wrapper.vm.$refs.editModal.show = jest.fn();

        wrapper.vm.showModal('context');

        expect(wrapper.vm.suggestions[0].ruleId)
            .toEqual('5b0d4c4e-8245-4bea-a2ad-cf0be0a441f5');
    });
});
