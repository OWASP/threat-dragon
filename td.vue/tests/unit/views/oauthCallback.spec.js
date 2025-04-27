import { nextTick } from 'vue';
import { createStore } from 'vuex';
import { AUTH_SET_JWT as _AUTH_SET_JWT } from '@/store/actions/auth.js';
import loginApi from '@/service/api/loginApi.js';
import OAuthCallback from '@/views/OAuthCallback.vue';
import { mount } from '@vue/test-utils';

// Mock vue-router
const mockPush = jest.fn();
jest.mock('vue-router', () => ({
    useRouter: () => ({
        push: mockPush
    }),
    useRoute: () => ({
        query: { code: '1234-12345' }
    })
}));

// Will mock window.location in each test case

// Mock loginApi
jest.mock('@/service/api/loginApi.js', () => ({
    completeLoginAsync: jest.fn()
}));

describe('views/OAuthCallback.vue', () => {
    const jwt = 'foobar';
    const code = '1234-12345';
    const provider = 'test';
    let _wrapper, mockStore;
    let originalLocation;

    beforeEach(() => {
        console.error = jest.fn();
        console.log = jest.fn();
        mockPush.mockClear();
        loginApi.completeLoginAsync.mockClear();
        
        // Save original location
        originalLocation = window.location;
        
        // Setup default window.location mock
        delete window.location;
        window.location = {
            search: '?code=1234-12345',
            hash: '',
            href: 'https://example.com/oauth-callback'
        };
    });

    afterEach(() => {
        // Restore original location after each test
        window.location = originalLocation;
    });

    describe('expected path', () => {
        beforeEach(async () => {
            // Create vuex store with the provider
            mockStore = createStore({
                state: {
                    provider: {
                        selected: provider
                    }
                },
                actions: {
                    AUTH_SET_JWT: jest.fn()
                }
            });
            
            // Spy on the dispatch method
            jest.spyOn(mockStore, 'dispatch');
            
            // Mock API response
            loginApi.completeLoginAsync.mockResolvedValue({ data: jwt });
            
            // Mount the component
            _wrapper = mount(OAuthCallback, {
                global: {
                    plugins: [mockStore]
                }
            });
            
            // Wait for mounted hook to execute
            await nextTick();
            await nextTick(); // Additional nextTick for async code
        });

        it('completes the login', () => {
            // Verify login was completed
            expect(loginApi.completeLoginAsync).toHaveBeenCalledWith(provider, code);
        });

        it('dispatches the AUTH_SET_JWT action', () => {
            // Verify store action was dispatched
            expect(mockStore.dispatch).toHaveBeenCalledWith('AUTH_SET_JWT', { data: jwt });
        });

        it('navigates to the dashboard', () => {
            // Verify navigation
            expect(mockPush).toHaveBeenCalledWith({ name: 'MainDashboard' });
        });
    });

    describe('missing provider', () => {
        it('displays an error when provider is missing', async () => {
            // Create vuex store without the provider
            mockStore = createStore({
                state: {
                    provider: {
                        selected: null
                    }
                }
            });
            
            // Spy on console.error
            console.error = jest.fn();
            
            // Mount the component
            _wrapper = mount(OAuthCallback, {
                global: {
                    plugins: [mockStore]
                }
            });
            
            // Wait for mounted hook and async operations to complete
            await nextTick();
            await nextTick();
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Verify error handling occurred
            expect(console.error).toHaveBeenCalled();
            
            // Check that the component displays the error message
            expect(_wrapper.find('.alert-danger').exists()).toBe(true);
            expect(_wrapper.text()).toContain('Error');
            expect(_wrapper.vm.errorOccurred).toBe(true);
            expect(_wrapper.vm.errorMessage).toContain('No provider found');
        });
    });
    
    describe('provider restoration from localStorage', () => {
        it('dispatches PROVIDER_SELECTED action when provider is found in localStorage', async () => {
            // Mock localStorage with provider data
            Object.defineProperty(window, 'localStorage', {
                value: {
                    getItem: jest.fn((key) => {
                        if (key === 'td_provider') return 'bitbucket';
                        if (key === 'td_providerUri') return 'https://bitbucket.org';
                        return null;
                    }),
                    setItem: jest.fn(),
                    removeItem: jest.fn()
                },
                writable: true
            });
            
            // Create store without provider in state but with dispatch spy
            mockStore = createStore({
                state: {
                    provider: {
                        selected: null
                    }
                },
                actions: {
                    PROVIDER_SELECTED: jest.fn()
                }
            });
            
            // Spy on the dispatch method
            jest.spyOn(mockStore, 'dispatch');
            
            // Mock API response
            loginApi.completeLoginAsync.mockResolvedValue({ data: jwt });
            
            // Mount the component
            _wrapper = mount(OAuthCallback, {
                global: {
                    plugins: [mockStore]
                }
            });
            
            // Wait for mounted hook and async operations to complete
            await nextTick();
            await nextTick();
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Verify that the PROVIDER_SELECTED action was dispatched with the provider from localStorage
            expect(mockStore.dispatch).toHaveBeenCalledWith('PROVIDER_SELECTED', 'bitbucket');
        });
    });
    
    describe('hash fragment code extraction', () => {
        const hashCode = 'hash-code-12345';
        
        beforeEach(async () => {
            // Reset mocks
            jest.clearAllMocks();
            mockPush.mockClear();
            loginApi.completeLoginAsync.mockClear();
            
            // Save original location
            const originalLocation = window.location;
            
            // Set up window.location to return hash fragment code
            delete window.location;
            window.location = {
                search: '',
                hash: `#/oauth-return?code=${hashCode}`,
                pathname: '/oauth-callback',
                href: `https://example.com/oauth-callback#/oauth-return?code=${hashCode}`
            };
            
            // Mock the loginApi to return data immediately
            loginApi.completeLoginAsync.mockImplementation((providerName, authCode) => {
                // Check for correct code extraction
                if (authCode === hashCode) {
                    return Promise.resolve({ data: jwt });
                }
                return Promise.reject(new Error('Invalid code'));
            });
            
            // Create store with provider
            mockStore = createStore({
                state: {
                    provider: {
                        selected: provider
                    }
                },
                actions: {
                    AUTH_SET_JWT: jest.fn()
                }
            });
            jest.spyOn(mockStore, 'dispatch');
            
            // Mount component - this will trigger the onMounted hook
            const _wrapper = mount(OAuthCallback, {
                global: {
                    plugins: [mockStore]
                }
            });
            
            // Wait for async operations to complete
            await nextTick();
            await nextTick(); 
            await nextTick();
            
            // Add longer delay to ensure async processes finish
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // Restore original window.location after test
            window.location = originalLocation;
        });
        
        it('extracts code from hash fragment', () => {
            // Verify the API call was made with the correct code from hash fragment
            expect(loginApi.completeLoginAsync).toHaveBeenCalledWith(provider, hashCode);
        });
    });

    describe('error handling', () => {
        beforeEach(async () => {
            // Create vuex store with the provider
            mockStore = createStore({
                state: {
                    provider: {
                        selected: provider
                    }
                }
            });
            
            // Mock API error
            loginApi.completeLoginAsync.mockRejectedValue(new Error('API error'));
            
            // Mount the component
            _wrapper = mount(OAuthCallback, {
                global: {
                    plugins: [mockStore]
                }
            });
            
            // Wait for mounted hook to execute
            await nextTick();
            await nextTick(); // Additional nextTick for async code
        });

        it('handles API errors gracefully', () => {
            expect(console.error).toHaveBeenCalled();
            expect(loginApi.completeLoginAsync).toHaveBeenCalled();
        });
    });
});
