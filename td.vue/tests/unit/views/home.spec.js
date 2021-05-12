import { BootstrapVue, BButton, BContainer, BJumbotron, BImg } from 'bootstrap-vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import { AUTH_SET_LOCAL } from '@/store/actions/auth.js';
import Home from '@/views/Home.vue';
import loginApi from '@/service/loginApi.js';
import { PROVIDER_SELECTED } from '@/store/actions/provider.js';
import router from '@/router/index.js';

describe('Home.vue', () => {
    const redirectUrl = 'https://threatdragon.org';

    let wrapper, localVue, mockStore;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(Vuex);
        localVue.use(BootstrapVue);
        localVue.component('font-awesome-icon', FontAwesomeIcon);
        mockStore = new Vuex.Store({
            actions: {
                [AUTH_SET_LOCAL]: () => {},
                [PROVIDER_SELECTED]: () => {}
            }
        });
        jest.spyOn(loginApi, 'loginAsync').mockResolvedValue({ data: redirectUrl });
        jest.spyOn(mockStore, 'dispatch');

        // There may be a better way of doing this
        // Source: https://remarkablemark.org/blog/2018/11/17/mock-window-location/
        delete window.location;
        window.location = { replace: jest.fn() };
        router.push = jest.fn();

        wrapper = shallowMount(Home, {
            localVue,
            store: mockStore,
            // router
        });
    });

    describe('layout', () => {

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

    describe('login with github', () => {
        beforeEach(async () => {
            await wrapper.find('#github-login-btn').trigger('click');
        });

        it('dispatches the provider selected event to the store', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith(PROVIDER_SELECTED, 'github');
        });

        it('gets the oauth login link', () => {
            expect(loginApi.loginAsync).toHaveBeenCalledWith('github');
        });
    });

    describe('local session login', () => {
        beforeEach(async () => {
            await wrapper.find('#local-login-btn').trigger('click');
        });

        it('dispatches the provider selected event to the store', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith(PROVIDER_SELECTED, 'local');
        });

        it('does not send an API request', () => {
            expect(loginApi.loginAsync).not.toHaveBeenCalled();
        });

        it('navigates to the dashboard', () => {
            expect(router.push).toHaveBeenCalledWith('/dashboard');
        });
    });
});
