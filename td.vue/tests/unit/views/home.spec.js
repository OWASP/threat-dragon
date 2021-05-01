import { BootstrapVue, BButton, BContainer, BJumbotron, BImg } from 'bootstrap-vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import Home from '@/views/Home.vue';
import router from '@/router/index.js';
import { PROVIDER_SELECTED } from '@/store/actions/provider.js';

describe('Home.vue', () => {
    let wrapper, localVue, mockStore;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(Vuex);
        localVue.use(BootstrapVue);
        localVue.component('font-awesome-icon', FontAwesomeIcon);
        mockStore = new Vuex.Store({
            actions: {
                [PROVIDER_SELECTED]: () => {}
            }
        });
    });

    describe('layout', () => {
        beforeEach(() => {
            wrapper = shallowMount(Home, {
                localVue,
                store: mockStore
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

    describe('provider selected', () => {
        beforeEach(() => {
            jest.spyOn(mockStore, 'dispatch');
            router.push('/');
            wrapper = shallowMount(Home, {
                localVue,
                store: mockStore
            });
        });

        it('dispatches the provider selected event to the store', async () => {
            await wrapper.findComponent(FontAwesomeIcon).trigger('click');
            expect(mockStore.dispatch).toHaveBeenCalled();
        });

        it('navigates to the dasbnoard page', async () => {
            jest.spyOn(router, 'push');
            await wrapper.findComponent(FontAwesomeIcon).trigger('click');
            expect(router.push).toHaveBeenCalledWith('/dashboard');
        });
    });
});
