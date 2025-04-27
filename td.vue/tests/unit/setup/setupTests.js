// This file is run before each test file
import { jest } from '@jest/globals';
import { config } from '@vue/test-utils';
import BootstrapVueNextMock from './bootstrap-vue-next';

// Import our electron mock
import electron from './electronMock';

// Create fs mock
const fsMock = {
    readFile: jest.fn((filename, callback) => callback(null, JSON.stringify({}))),
    writeFile: jest.fn((filename, data, callback) => callback(null)),
    existsSync: jest.fn(() => true)
};

// Mock require function for CommonJS imports in ES modules
global.require = jest.fn((module) => {
    if (module === 'electron') {
        return electron;
    }
    if (module === 'fs') {
        return fsMock;
    }
    // Add other module mocks as needed
    return {};
});

// Setup global toast for all tests
global.$toast = {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn()
};

// Make sure window.$toast is also defined
window.$toast = global.$toast;

// Configure Vue Test Utils global plugins
config.global.plugins = [BootstrapVueNextMock];

// Configure Vue Test Utils to silence the warnings about components that couldn't be auto-resolved
// This is needed because Vue 3 warns about components that couldn't be resolved, even if they are mocked
config.global.config = {
    warnHandler: (msg, _instance, _trace) => {
    // Silence the component resolution warnings that we've already handled with our mocks
        if (msg.includes('Failed to resolve component')) {
            return;
        }
        console.warn(msg);
    }
};

// Set compilerOptions to properly handle custom elements
config.global.compilerOptions = {
    isCustomElement: (tag) => tag.startsWith('b-')
};