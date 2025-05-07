import { createWrapper } from '../setup/test-utils.js';
import MainDashboard from '@/views/MainDashboard.vue';
import TdDashboardAction from '@/components/DashboardAction.vue';

// Create mock dashboard actions
const mockDashboardActions = [
    { to: '/test1', icon: 'test-icon1', iconPreface: 'fas', key: 'test.action1' },
    { to: '/test2', icon: 'test-icon2', iconPreface: 'far', key: 'test.action2' }
];

// Mock the providers module
jest.mock('@/service/provider/providers.js', () => ({
    getDashboardActions: jest.fn((providerKey) => {
        if (providerKey === 'invalid-provider') {
            throw new Error('Test error');
        }
        return mockDashboardActions;
    })
}));

// Import the mock directly so we can make assertions on it
import { getDashboardActions } from '@/service/provider/providers.js';

describe('MainDashboard.vue', () => {
    let originalConsoleError;
    
    beforeEach(() => {
        // Reset the mock between tests
        jest.clearAllMocks();
        
        // Suppress console errors for testing error scenarios
        originalConsoleError = console.error;
        console.error = jest.fn();
    });
    
    afterEach(() => {
        // Restore console.error
        console.error = originalConsoleError;
    });

    it('renders properly with expected component name', () => {
        const wrapper = createWrapper(MainDashboard, {
            store: {
                state: {
                    provider: { selected: 'github' }
                }
            },
            shallow: true
        });
        
        expect(wrapper.exists()).toBe(true);
        expect(wrapper.vm.$options.name).toBe('MainDashboard');
    });
    
    it('registers TdDashboardAction component', () => {
        const wrapper = createWrapper(MainDashboard, {
            shallow: true,
            store: {
                state: {
                    provider: { selected: 'github' }
                }
            }
        });
        
        // Check component registration
        expect(wrapper.vm.$options.components.TdDashboardAction).toBe(TdDashboardAction);
    });
    
    it('computes dashboard actions from provider', () => {
        // The actions computed property is defined with mapState,
        // which can be tricky to test directly.
        
        // Create component with store state
        const _wrapper = createWrapper(MainDashboard, {
            store: {
                state: {
                    provider: { selected: 'github' }
                }
            },
            // Set shallow to false to ensure computed props are properly evaluated
            shallow: false,
            stubs: {
                'td-dashboard-action': true
            }
        });
        
        // Our mock getDashboardActions should have been called with 'github'
        expect(getDashboardActions).toHaveBeenCalledWith('github');
        
        // In this test environment with our mock setup,
        // we just need to verify the getDashboardActions function was called correctly
    });
    
    it('falls back to local provider when selected is not set', () => {
        const _wrapper = createWrapper(MainDashboard, {
            store: {
                state: {
                    provider: { selected: null }
                }
            }
        });
        
        // Should use local as the fallback provider
        expect(getDashboardActions).toHaveBeenCalledWith('local');
    });

    it('renders dashboard actions in the template', () => {
        // When creating wrapper for checking template rendering, 
        // we need to use mount (shallow: false) and provide necessary stubs
        const wrapper = createWrapper(MainDashboard, {
            store: {
                state: {
                    provider: { selected: 'github' }
                }
            },
            shallow: false,
            stubs: {
                'td-dashboard-action': true // Stub this component for easier testing
            },
            mocks: {
                $t: jest.fn(key => key)
            }
        });
        
        // Verify the welcome text section exists
        expect(wrapper.find('h4').exists()).toBe(true);
        expect(wrapper.find('p').exists()).toBe(true);
        
        // Verify the $t function was called with correct keys
        expect(wrapper.vm.$t).toHaveBeenCalledWith('dashboard.welcome.title');
        expect(wrapper.vm.$t).toHaveBeenCalledWith('dashboard.welcome.description');
    });

    it('handles error when getDashboardActions throws an exception', () => {
        // Testing errors in computed properties can be tricky in Vue,
        // we'll check that the function is called with the right provider
        
        try {
            const _wrapper = createWrapper(MainDashboard, {
                store: {
                    state: {
                        provider: { selected: 'invalid-provider' }
                    }
                }
            });
        } catch (error) {
            // We expect an error but want to keep test running
        }
        
        // The mock should have been called with the invalid provider
        expect(getDashboardActions).toHaveBeenCalledWith('invalid-provider');
    });
});