import { BootstrapVue } from 'bootstrap-vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

import Diagram from '@/views/Diagram.vue';
import TdGraph from '@/components/Graph.vue';

describe('Diagram.vue', () => {
    let wrapper, localVue, mockStore;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(BootstrapVue);
        localVue.use(Vuex);
        mockStore = new Vuex.Store({
            state: {
                threatmodel: {
                    selectedDiagram: {
                        title: 'Foobar'
                    }
                }
            }
        });
        wrapper = shallowMount(Diagram, {
            localVue,
            store: mockStore
        });
    });

    it('shows the diagram title', () => {
        expect(wrapper.find('.text-center').text()).toEqual('Foobar');
    });

    it('renders the graph component', () => {
        expect(wrapper.findComponent(TdGraph).exists()).toEqual(true);
    });
});
