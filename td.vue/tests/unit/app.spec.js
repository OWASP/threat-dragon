import { BootstrapVue, BContainer } from 'bootstrap-vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import VueI18n from 'vue-i18n';
import Vuex from 'vuex';

import App from '@/App.vue';
import i18nFactory from '@/i18n/index.js';
import { LOADER_FINISHED } from '@/store/actions/loader.js';
import Navbar from '@/components/Navbar.vue';

describe('App.vue', () => {
    let wrapper, localVue, mockStore;

    beforeEach(() => {
        console.log = jest.fn();
        localVue = createLocalVue();
        localVue.use(BootstrapVue);
        localVue.use(Vuex);
        localVue.use(VueI18n);
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
            i18n: i18nFactory.get(),
            stubs: ['router-view'],
            store: mockStore,
            mocks: {
                $t: key => key
            }
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
