/**
 * Plausible Analytics integration service.
 * Only loads the Plausible tracker script when analytics are enabled.
 * Never loads in desktop/Electron environments.
 */
import { isDesktopApp } from '@/service/environment';

let initialized = false;

/**
 * Injects the Plausible tracker script into the document head.
 * @param {Object} plausibleConfig - The plausible config from the server
 * @param {boolean} plausibleConfig.enabled
 * @param {string} plausibleConfig.url - The Plausible instance URL
 * @param {string} plausibleConfig.domain - The domain to track
 */
export const initPlausible = (plausibleConfig) => {
    if (initialized) {
        return;
    }

    if (!plausibleConfig || !plausibleConfig.enabled) {
        return;
    }

    if (isDesktopApp()) {
        return;
    }

    if (!plausibleConfig.domain) {
        console.warn('Plausible analytics enabled but no domain configured');
        return;
    }

    const url = plausibleConfig.url || 'https://plausible.io';
    const scriptSrc = `${url}/js/script.js`;

    const script = document.createElement('script');
    script.defer = true;
    script.setAttribute('data-domain', plausibleConfig.domain);
    script.src = scriptSrc;
    document.head.appendChild(script);

    // Plausible uses a global `plausible` function for custom events
    window.plausible = window.plausible || function () {
        (window.plausible.q = window.plausible.q || []).push(arguments);
    };

    initialized = true;
};

/**
 * Tracks a custom event via Plausible.
 * No-op if Plausible has not been initialized.
 * @param {string} eventName - One of the analyticsEvents enum values
 * @param {Object} [props] - Optional event properties (must not contain user-identifiable data)
 */
export const trackEvent = (eventName, props) => {
    if (!initialized || typeof window.plausible !== 'function') {
        return;
    }

    if (props) {
        window.plausible(eventName, { props });
    } else {
        window.plausible(eventName);
    }
};

/**
 * Returns whether Plausible has been initialized.
 * Useful for tests.
 * @returns {boolean}
 */
export const isInitialized = () => initialized;

/**
 * Resets the initialized state. For testing only.
 */
export const _resetForTesting = () => {
    initialized = false;
};
