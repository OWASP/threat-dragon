import { BootstrapVue, BContainer, BJumbotron, BImg } from 'bootstrap-vue';
import { expect } from 'chai';
import { shallowMount, createLocalVue } from '@vue/test-utils';

import Home from '@/views/Home.vue';

describe('Home.vue', () => {
    let wrapper, localVue;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(BootstrapVue);
        wrapper = shallowMount(Home, {
            localVue
        });
    });

    it('renders the home view', () => {
        expect(wrapper.exists()).to.be.true;
    });

    it('has a b-container', () => {
        expect(wrapper.findComponent(BContainer).exists()).to.be.true;
    });

    it('has a jumbotron', () => {
        expect(wrapper.findComponent(BJumbotron).exists()).to.be.true;
    });

    it('displays the title', () => {
        expect(wrapper.find('h1.display-3').text()).to.contain('OWASP');
    });

    it('displays the threat dragon log', () => {
        expect(wrapper.findComponent(BImg).attributes('src'))
            .to.contain('threatdragon_logo_image').and.contain('.svg');
    });

    it('has the description of the project', () => {
        expect(wrapper.find('p').exists()).to.be.true;
    });
});
