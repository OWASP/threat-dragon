import { nextTick } from 'vue';
import { createWrapper } from '../setup/test-utils.js';

import { AUTH_SET_LOCAL } from '@/store/actions/auth.js';
import loginApi from '@/service/api/loginApi.js';
import { PROVIDER_SELECTED } from '@/store/actions/provider.js';
import TdProviderLoginButton from '@/components/ProviderLoginButton.vue';
import { providerNames as _providerNames } from '@/service/provider/providers.js';

// Mock the loginApi module
jest.mock('@/service/api/loginApi.js', () => ({
    loginAsync: jest.fn()
}));

// Mock the provider names to ensure consistent behavior
jest.mock('@/service/provider/providers.js', () => ({
    providerNames: {
        local: 'local',
        desktop: 'desktop',
        github: 'github'
    }
}));

describe('components/ProviderLoginButton.vue', () => {
    // Factory functions for reusable test data
    const getProvider = () => ({
        key: 'github',
        displayName: 'GitHub',
        provider: {},
        icon: ['fab', 'github']
    });
    
    const getMockDispatch = () => jest.fn().mockImplementation(async (_action) => {
        // Return a resolved promise to simulate async behavior
        return Promise.resolve();
    });

    let wrapper, dispatchMock, provider, routerMock;

    // Vue 3 Migration: Setup function to create the component with different providers
    const mountWithProvider = () => {
        routerMock = { push: jest.fn() };
        dispatchMock = getMockDispatch();
        
        // Mock window.location.href using a simpler approach
        const originalHref = window.location.href;
        Object.defineProperty(window, 'location', {
            writable: true,
            value: { href: originalHref }
        });
        
        // Vue 3 Migration: Using createWrapper with improved stubs
        wrapper = createWrapper(TdProviderLoginButton, {
            props: {
                provider
            },
            shallow: false,
            stubs: {
                // Vue 3 Migration: Custom stub for font-awesome-icon
                'font-awesome-icon': {
                    template: '<div class="fa-stub" :data-icon="icon.join(\',\')"><slot /></div>',
                    props: ['icon', 'size', 'color']
                },
                // Properly stub BButton to make it render as a real button
                'BButton': {
                    template: '<button :id="id" :class="classNames" :variant="variant" @click="$emit(\'click\')"><slot /></button>',
                    props: ['id', 'variant', 'class'],
                    computed: {
                        classNames() {
                            return ['btn', 'm-1', 'btn-' + (this.variant || 'secondary')];
                        }
                    }
                }
            },
            mocks: {
                $router: routerMock,
                $store: {
                    dispatch: dispatchMock
                }
            }
        });

        return { dispatchMock, routerMock };
    };

    // Vue 3 Migration: Organize tests by provider type
    describe('Component structure', () => {
        beforeEach(() => {
            provider = getProvider();
            mountWithProvider();
        });

        it('renders a button with correct attributes', () => {
            // Vue 3 Migration: Test component rendering with proper CSS class and attribute testing
            const button = wrapper.find('button');
            expect(button.exists()).toBe(true);
            expect(button.classes()).toContain('m-1');
            expect(button.attributes('id')).toBe(`${provider.key}-login-btn`);
        });

        it('renders the font awesome icon with correct props', () => {
            // Vue 3 Migration: Testing custom font-awesome-icon stub
            const icon = wrapper.find('.fa-stub');
            expect(icon.exists()).toBe(true);
            expect(icon.attributes('data-icon')).toBe(provider.icon.join(','));
        });

        it('displays translated provider text', () => {
            // Vue 3 Migration: Testing the component's i18n text rendering
            const buttonText = wrapper.text();
            // Since $t is mocked to return the key, we can check for the keys
            expect(buttonText).toContain(`providers.${provider.key}.loginWith`);
            expect(buttonText).toContain(`providers.${provider.key}.displayName`);
        });
    });

    describe('Local provider', () => {
        beforeEach(async () => {
            provider = getProvider();
            provider.key = 'local';
            mountWithProvider();
            
            // Vue 3 Migration: Find and click the button directly
            await wrapper.find('button').trigger('click');
            await nextTick();
        });

        it('dispatches provider selection with correct key', () => {
            expect(dispatchMock).toHaveBeenCalledWith(PROVIDER_SELECTED, provider.key);
        });

        it('dispatches AUTH_SET_LOCAL for local provider', () => {
            expect(dispatchMock).toHaveBeenCalledWith(AUTH_SET_LOCAL);
        });

        it('navigates to dashboard', () => {
            expect(routerMock.push).toHaveBeenCalledWith('/dashboard');
        });
    });

    describe('External provider (GitHub)', () => {
        beforeEach(async () => {
            provider = getProvider();
            // Mock the loginApi to return a URL
            loginApi.loginAsync.mockResolvedValue({ data: 'https://example.com/auth' });
            mountWithProvider();
            
            // Vue 3 Migration: Find and click the button directly
            await wrapper.find('button').trigger('click');
            await nextTick();
        });

        it('dispatches provider selection with correct key', () => {
            expect(dispatchMock).toHaveBeenCalledWith(PROVIDER_SELECTED, provider.key);
        });

        it('calls loginAsync with provider key', () => {
            expect(loginApi.loginAsync).toHaveBeenCalledWith(provider.key);
        });

        it('redirects to the URL returned from login API', () => {
            // This test now doesn't rely on spying but checks window.location.href directly
            expect(window.location.href).toBe('https://example.com/auth');
        });
    });

    // Vue 3 Migration: Clean up after all tests
    afterAll(() => {
        // Restore window.location
        jest.restoreAllMocks();
    });
});