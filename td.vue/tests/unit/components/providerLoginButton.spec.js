import { BButton, BootstrapVue } from 'bootstrap-vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import { AUTH_SET_LOCAL } from '@/store/actions/auth.js';
import loginApi from '@/service/api/loginApi.js';
import { PROVIDER_SELECTED } from '@/store/actions/provider.js';
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
            [AUTH_SET_LOCAL]: () => {},
            [PROVIDER_SELECTED]: () => {}
        }
    });

    const mountWithProvider = () => {
        localVue = createLocalVue();
        localVue.use(BootstrapVue);
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
                await wrapper.findComponent(BButton).trigger('click');
            });

            it('reads the provider value', () => {
                expect(wrapper.props().provider).toEqual(provider);
            });
    
            it('uses a bootstrap button', () => {
                expect(wrapper.findComponent(BButton).exists()).toEqual(true);
            });
    
            it('uses a font awesome icon', () => {
                expect(wrapper.findComponent(FontAwesomeIcon).exists()).toEqual(true);
            });

            it('dipatches the provider selected event', () => {
                expect(mockStore.dispatch).toHaveBeenCalledWith(PROVIDER_SELECTED, provider.key);
            });

            it('dispatches the set local event', () => {
                expect(mockStore.dispatch).toHaveBeenCalledWith(AUTH_SET_LOCAL);
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
                await wrapper.findComponent(BButton).trigger('click');
            });

            it('dipatches the provider selected event', () => {
                expect(mockStore.dispatch).toHaveBeenCalledWith(PROVIDER_SELECTED, provider.key);
            });

            it('calls the login api', () => {
                expect(loginApi.loginAsync).toHaveBeenCalledWith(provider.key);
            });
        });
    });

});
