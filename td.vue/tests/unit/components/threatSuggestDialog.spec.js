import { BootstrapVue } from 'bootstrap-vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

import TdDropdown from '@/components/Dropdown.vue';
import TdThreatSuggestDialog from '@/components/ThreatSuggestDialog.vue';

describe('components/ThreatSuggestDialog.vue', () => {
    let localVue, wrapper;

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

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(Vuex);
        localVue.use(BootstrapVue);
        wrapper = shallowMount(TdThreatSuggestDialog, {
            localVue,
            mocks: { $t: key => key },
            store: getStore()
        });
    });

    it('renders the status as a dropdown', () => {
        const dropdown = wrapper.findAllComponents(TdDropdown)
            .filter(x => x.attributes('id') === 'status')
            .at(0);

        expect(dropdown.exists()).toEqual(true);
    });

    it('shows the selected status as the dropdown text', () => {
        wrapper.vm.threat = { status: 'Mitigated' };
        expect(wrapper.vm.selectedStatusText).toEqual('threats.status.mitigated');
    });

    it('shows empty dropdown text when no status is selected', () => {
        expect(wrapper.vm.selectedStatusText).toEqual('');
    });
});
