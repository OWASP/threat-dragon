/**
 * Fixed test setup file
 *
 * This version uses custom implementations for Vue 3 tests
 */

import { beforeEach, afterEach, vi } from 'vitest';
import { mockI18n, mockToast } from './vue3-test-utils-fixed';
import registerMatchers from '../../matchers/custom';

// Register custom matchers to provide Jest compatibility and more
registerMatchers();

// Setup global CSS for test environment
const style = document.createElement('style');
style.textContent = `
  .p-button { display: inline-flex; }
  .p-card { display: block; }
  .p-dialog { display: block; }
  .p-panel { display: block; }
`;
document.head.appendChild(style);

// Mock console methods to avoid noise in test output
beforeEach(() => {
    console.log = vi.fn();
    console.debug = vi.fn();
    console.warn = vi.fn();
});

// Reset all mocks between tests
afterEach(() => {
    vi.restoreAllMocks();
});

// Mock browser APIs that might not be available in jsdom
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

// Mock Vue
vi.mock('vue', async () => {
    const actual = await vi.importActual('vue');
    return {
        ...actual,
        default: {
            ...actual,
            use: vi.fn(),
            component: vi.fn(),
            directive: vi.fn(),
            mixin: vi.fn(),
            version: '3.0.0',
        },
    };
});

// Vue-demi has been removed, no need to mock it

// Mock Vue i18n
vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: (key) => key,
    }),
    createI18n: vi.fn(() => ({
        global: {
            t: (key) => key,
        },
    })),
    VueI18n: vi.fn(),
}));

// Mock Vue Router for tests
vi.mock('vue-router', () => ({
    useRouter: vi.fn(() => ({
        push: vi.fn(),
        replace: vi.fn(),
        go: vi.fn(),
    })),
    useRoute: vi.fn(() => ({
        params: {},
        query: {},
        path: '/',
        name: 'MockedRoute',
    })),
}));

// Mock PrimeVue components
vi.mock('primevue/button', () => ({
    default: {
        name: 'Button',
        props: {
            severity: String,
            icon: String,
        },
        template: '<button class="p-button"><slot /></button>',
    },
}));

vi.mock('primevue/panel', () => ({
    default: {
        name: 'Panel',
        template: '<div class="p-panel"><slot name="content" /></div>',
    },
}));

vi.mock('primevue/card', () => ({
    default: {
        name: 'Card',
        template: '<div class="p-card"><div class="p-card-content"><slot /></div></div>',
    },
}));

vi.mock('primevue/dialog', () => ({
    default: {
        name: 'Dialog',
        props: {
            visible: Boolean,
        },
        template: '<div class="p-dialog" v-if="visible"><slot /></div>',
    },
}));

vi.mock('primevue/config', () => ({
    PrimeVueSymbol: Symbol('primevue'),
    default: {
        install: vi.fn(),
    },
}));

// Mock services
vi.mock('@/service/threats/index.js', () => ({
    default: {
        getAllThreatTypes: vi.fn().mockReturnValue(['Spoofing', 'Tampering']),
        getAllStatusTypes: vi.fn().mockReturnValue(['Open', 'Mitigated']),
        getAllSeverityTypes: vi.fn().mockReturnValue(['High', 'Medium', 'Low']),
        getThreatTypeByValue: vi.fn().mockReturnValue({ name: 'Some Threat Type' }),
    },
}));

// Process mocking for Electron context
vi.mock('process', () => ({
    env: {
        NODE_ENV: 'test',
    },
}));

// Common mocks for all tests
mockI18n();
mockToast();

// Export test utilities
export * from './vue3-test-utils-fixed';
