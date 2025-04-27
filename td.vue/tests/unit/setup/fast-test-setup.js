/**
 * Fast Test Setup
 *
 * This file provides common test utilities, mocks, and setup
 * for optimized test execution. It includes:
 *
 * - Console output suppression for cleaner test output
 * - Common mocks for Vue ecosystem (i18n, router, etc.)
 * - Standard mock implementations for fetch, localStorage, etc.
 * - Bootstrap-Vue component stubs
 */

import { vi } from 'vitest';
import { bootstrapVueStubs } from './bootstrap-vue-stubs';

// Suppress console warnings during test execution
// This improves performance and reduces noise in test output
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

// List of warning messages to suppress
const suppressPatterns = [
    '[Vue warn]',
    'Unknown custom element: <b-',
    'vue-i18n',
    'Unknown prop',
    'Invalid prop',
    'Missing required prop',
    'Non-function value encountered for default slot',
    'Extraneous non-props attributes',
    'Failed to resolve component',
];

// Override console.warn to suppress certain messages
console.warn = (message, ...args) => {
    if (
        typeof message === 'string' &&
        suppressPatterns.some((pattern) => message.includes(pattern))
    ) {
        return;
    }
    originalConsoleWarn(message, ...args);
};

// Override console.error to suppress certain messages
console.error = (message, ...args) => {
    if (
        typeof message === 'string' &&
        suppressPatterns.some((pattern) => message.includes(pattern))
    ) {
        return;
    }
    originalConsoleError(message, ...args);
};

// Global mock implementations to speed up tests
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

global.fetch = vi.fn().mockImplementation(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
        text: () => Promise.resolve(''),
        blob: () => Promise.resolve(new Blob()),
    })
);

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: vi.fn((key) => store[key] || null),
        setItem: vi.fn((key, value) => {
            store[key] = value.toString();
        }),
        removeItem: vi.fn((key) => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            store = {};
        }),
        key: vi.fn((index) => Object.keys(store)[index] || null),
        length: vi.fn(() => Object.keys(store).length),
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

// Mock for matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock Intersection Observer
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
    root: null,
    rootMargin: '',
    thresholds: [],
}));

// Make bootstrap stubs available globally
global.bootstrapVueStubs = bootstrapVueStubs;

// Export console restore function for tests that need to check console output
export const restoreConsole = () => {
    console.warn = originalConsoleWarn;
    console.error = originalConsoleError;
};

// Cleanup function to reset mocks between tests
export const cleanupMocks = () => {
    vi.clearAllMocks();
    localStorageMock.clear();
};

// Helper to mock element dimensions
export const mockElementDimensions = (element, width, height) => {
    Object.defineProperties(element, {
        offsetWidth: { value: width, configurable: true },
        offsetHeight: { value: height, configurable: true },
        clientWidth: { value: width, configurable: true },
        clientHeight: { value: height, configurable: true },
        getBoundingClientRect: {
            value: () => ({
                width,
                height,
                top: 0,
                left: 0,
                right: width,
                bottom: height,
                x: 0,
                y: 0,
            }),
            configurable: true,
        },
    });
};

// Export functions and mocks for direct use in tests
export { bootstrapVueStubs };
