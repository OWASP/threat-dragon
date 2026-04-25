import { createBootstrap } from 'bootstrap-vue-next';
import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';

import { createLocalVue, mountOptions } from './helpers/vueTestUtils';
import App from '@/App.vue';
import i18nFactory from '@/i18n/index.js';
import { LOADER_FINISHED } from '@/store/actions/loader.js';
import Navbar from '@/components/Navbar.vue';

describe('App.vue', () => {
    let wrapper, localVue, mockStore;

    beforeEach(() => {
        console.log = jest.fn();
        localVue = createLocalVue();
        localVue.use(createBootstrap());
        mockStore = createStore({
            state: {
                loader: {
                    loading: false
                }
            },
            actions: {
                [LOADER_FINISHED]: () => {}
            }
        });
        wrapper = shallowMount(App, mountOptions(localVue, {
            store: mockStore,
            i18n: i18nFactory.get(),
            stubs: ['router-view'],
            mocks: {
                $t: key => key
            }
        }));
    });

    it('renders the app', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('has the navbar', () => {
        expect(wrapper.findComponent(Navbar).exists()).toBe(true);
    });

    it('has a b-container', () => {
        expect(wrapper.find('#app').exists()).toBe(true);
    });
});
