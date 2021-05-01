import { BootstrapVue, BButton, BContainer, BJumbotron, BImg } from 'bootstrap-vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { shallowMount, createLocalVue } from '@vue/test-utils';

import Home from '@/views/Home.vue';

describe('Home.vue', () => {
    let wrapper, localVue;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(BootstrapVue);
        localVue.component('font-awesome-icon', FontAwesomeIcon);
        wrapper = shallowMount(Home, {
            localVue
        });
    });

    it('renders the home view', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('has a b-container', () => {
        expect(wrapper.findComponent(BContainer).exists()).toBe(true);
    });

    it('has a jumbotron', () => {
        expect(wrapper.findComponent(BJumbotron).exists()).toBe(true);
    });

    it('displays the title', () => {
        expect(wrapper.find('h1.display-3').text()).toContain('OWASP');
    });

    it('displays the threat dragon log', () => {
        expect(wrapper.findComponent(BImg).attributes('src'))
            .toContain('threatdragon_logo_image');
    });

    it('has the description of the project', () => {
        expect(wrapper.find('p').exists()).toBe(true);
    });

    it('has a github login button', () => {
        expect(wrapper.findComponent(BButton).attributes('id')).toEqual('github-login-btn');
    });
});
