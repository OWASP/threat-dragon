import { shallowMount } from '@vue/test-utils';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Vuex from 'vuex';

import { createLocalVue } from '../helpers/vueTestUtils';
import { authSetLocal } from '@/store/actions/auth.js';
import loginApi from '@/service/api/loginApi.js';
import { providerSelected } from '@/store/actions/provider.js';
import TdProviderLoginButton from '@/components/ProviderLoginButton.vue';

describe('components/ProviderLoginButton.vue', () => {
    const getProvider = () => ({
        key: 'github',
        displayName: 'GitHub',
        provider: {},
        icon: ['fab', 'github']
    });
    const getMockStore = () => ({
        actions: {
            [authSetLocal]: () => {},
            [providerSelected]: () => {}
        }
    });

    const mountWithProvider = () => {
        localVue = createLocalVue();
        localVue.component('font-awesome-icon', FontAwesomeIcon);
        localVue.use(Vuex);
        
        routerMock = { push: jest.fn() };
        mockStore = new Vuex.Store(getMockStore());

        jest.spyOn(mockStore, 'dispatch');

        wrapper = shallowMount(TdProviderLoginButton, {
            localVue,
            propsData: {
                provider
            },
            mocks: {
                $router: routerMock,
                $t: key => key
            },
            store: mockStore
        });
    };

    let wrapper, localVue, mockStore, provider, routerMock;

    describe('components', () => {
        describe('local session', () => {
            beforeEach(async () => {
                provider = getProvider();
                provider.key = 'local';
                mountWithProvider();
                await wrapper.findComponent({ name: 'BButton' }).trigger('click');
            });

            it('reads the provider value', () => {
                expect(wrapper.props().provider).toEqual(provider);
            });
    
            it('uses a bootstrap button', () => {
                expect(wrapper.findComponent({ name: 'BButton' }).exists()).toEqual(true);
            });
    
            it('uses a font awesome icon', () => {
                expect(wrapper.findComponent(FontAwesomeIcon).exists()).toEqual(true);
            });

            it('dipatches the provider selected event', () => {
                expect(mockStore.dispatch).toHaveBeenCalledWith(providerSelected, provider.key);
            });

            it('dispatches the set local event', () => {
                expect(mockStore.dispatch).toHaveBeenCalledWith(authSetLocal);
            });

            it('navigates to the dashboard', () => {
                expect(routerMock.push).toHaveBeenCalledWith('/dashboard');
            });
        });

        describe('other provider', () => {
            beforeEach(async () => {
                provider = getProvider();
                jest.spyOn(loginApi, 'loginAsync').mockResolvedValue({ data: '' });
                mountWithProvider();
                await wrapper.findComponent({ name: 'BButton' }).trigger('click');
            });

            it('dipatches the provider selected event', () => {
                expect(mockStore.dispatch).toHaveBeenCalledWith(providerSelected, provider.key);
            });

            it('calls the login api', () => {
                expect(loginApi.loginAsync).toHaveBeenCalledWith(provider.key);
            });
        });
    });

});
