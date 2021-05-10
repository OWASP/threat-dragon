import { BootstrapVue, BContainer } from 'bootstrap-vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import App from '@/App.vue';
import { LOADER_FINISHED } from '@/store/actions/loader.js';
import Navbar from '@/components/Navbar.vue';

describe('App.vue', () => {
    let wrapper, localVue, mockStore;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(BootstrapVue);
        localVue.use(Vuex);
        mockStore = new Vuex.Store({
            state: {
                loader: {
                    loading: false
                }
            },
            actions: {
                [LOADER_FINISHED]: () => {}
            }
        });
        wrapper = shallowMount(App, {
            localVue,
            stubs: ['router-view'],
            store: mockStore
        });
    });

    it('renders the app', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('has the navbar', () => {
        expect(wrapper.findComponent(Navbar).exists()).toBe(true);
    });

    it('has a b-container', () => {
        expect(wrapper.findComponent(BContainer).exists()).toBe(true);
    });
});
