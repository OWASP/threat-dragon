import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-default.css';
import { ref } from 'vue';
import logger from '@/utils/logger.js';

// Create a context-specific logger
const log = logger.getLogger('plugin:toast-notification');

/**
 * Vue 3 Toast Notification System
 *
 * This module provides a standardized Vue 3 toast notification system
 * using the Composition API pattern. It handles both component and non-component
 * contexts gracefully and provides fallbacks for testing environments.
 */

// Create a mock toast service for testing and fallback purposes
const createMockToast = () => ({
    open: (msg) => {
        log.debug('Toast notification', { message: msg });
    },
    success: (msg) => {
        log.debug('Success notification', { message: msg });
    },
    error: (msg) => {
        log.error('Error notification', { message: msg });
    },
    warning: (msg) => {
        log.warn('Warning notification', { message: msg });
    },
    info: (msg) => {
        log.info('Info notification', { message: msg });
    }
});

// Store a reactive reference to the toast instance
const toast = ref(null);

/**
 * Composition API hook for accessing toast notifications
 * @returns {Object} Toast notification methods (success, error, warning, info, open)
 */
export const useToast = () => {
    // If we have a toast instance in the ref, use it
    if (toast.value) {
        return toast.value;
    }

    // Try to get the global toast instance
    if (typeof window !== 'undefined' && window.$toast) {
        toast.value = window.$toast;
        return window.$toast;
    }

    // Last resort, return a mock implementation
    return createMockToast();
};

/**
 * Plugin for Vue 3 to install toast notifications
 */
export const toastNotificationPlugin = {
    install(app, options = {}) {
        // Default toast options
        const toastOptions = {
            position: 'top-right',
            duration: 3000,
            ...options
        };

        try {
            // Register the toast plugin
            app.use(ToastPlugin, toastOptions);

            // Get the toast instance from the app
            const toastInstance = app.config.globalProperties.$toast;

            // Store it in our reactive ref
            toast.value = toastInstance;

            // Make it globally available for non-component contexts
            if (typeof window !== 'undefined') {
                window.$toast = toastInstance;
            }
        } catch (err) {
            log.error('Error initializing toast plugin', { error: err });

            // Create a fallback mock implementation
            const mockToast = createMockToast();

            // Set it on app.config.globalProperties
            app.config.globalProperties.$toast = mockToast;

            // Store it in our reactive ref
            toast.value = mockToast;

            // Make it globally available
            if (typeof window !== 'undefined') {
                window.$toast = mockToast;
            }
        }
    }
};

// For backward compatibility with non-Composition API code
if (typeof window !== 'undefined') {
    window.useToast = useToast;
}

export default toastNotificationPlugin;
