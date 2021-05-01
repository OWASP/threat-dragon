import { BootstrapVue, BContainer } from 'bootstrap-vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';

import App from '@/App.vue';
import Navbar from '@/components/Navbar.vue';

describe('App.vue', () => {
    let wrapper, localVue;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(BootstrapVue);
        wrapper = shallowMount(App, {
            localVue,
            stubs: ['router-view']
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
