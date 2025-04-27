import { createI18n, useI18n as vueUseI18n } from 'vue-i18n';
import logger from '@/utils/logger.js';

// Create a context-specific logger
const log = logger.getLogger('i18n');

/**
 * Vue 3 Internationalization Module
 *
 * This module provides standardized access to translations using Vue 3's Composition API.
 * It maintains backward compatibility with code that uses the older patterns.
 */

// The language codes follow Internet Engineering Task Force (IETF) Best Current Practice (BCP) 47
// Using codes from ISO 639-2
import ara from './ar.js';
import deu from './de.js';
import ell from './el.js';
import ind from './id.js'; // Indonesian
import eng from './en.js';
import fin from './fi.js';
import fra from './fr.js';
import heb from './he.js'; // Hebrew
import hin from './hi.js';
import jpn from './ja.js';
import msa from './ms.js';
import por from './pt.js';
import rus from './ru.js';
import spa from './es.js';
import tha from './th.js'; // Thai
import ukr from './uk.js';
import zho from './zh.js';

// Singleton instance of i18n
let i18n = null;

/**
 * Creates or returns the i18n instance
 * @returns {I18n} The i18n instance
 */
const getI18n = () => {
    if (!i18n) {
        i18n = createI18n({
            legacy: false, // Use Composition API mode
            locale: 'eng',
            escapeParameter: true, // Escape special characters in parameters
            messages: {
                ara,
                deu,
                ell,
                eng,
                spa,
                fin,
                fra,
                heb,
                hin,
                ind,
                jpn,
                msa,
                por,
                rus,
                tha,
                ukr,
                zho
            }
        });
    }
    return i18n;
};

/**
 * Composition API hook for accessing i18n within components
 * @returns {Object} The i18n composition API utilities (t, locale, etc)
 */
export const useI18n = () => {
    // Check if we're in a test environment
    if (process.env.NODE_ENV === 'test' || (typeof global !== 'undefined' && global.jest)) {
        // Return a mock translation function for tests
        return {
            t: (key) => key,
            locale: { value: 'eng' },
            availableLocales: ['eng', 'deu', 'fra']
        };
    }

    // Use the vue-i18n provided useI18n hook for normal operation
    try {
        return vueUseI18n();
    } catch (e) {
        // Return a simple mock if something goes wrong
        log.warn('Error in useI18n', { error: e });
        return {
            t: (key) => key,
            locale: { value: 'eng' },
            availableLocales: ['eng']
        };
    }
};

/**
 * This is a migration helper that adds Composition API support to Options API components.
 * Use this function in the setup() method of your component to get both Options API ($t)
 * and Composition API (t) working side by side during the migration process.
 * 
 * @example
 * export default {
 *   setup() {
 *     return useI18nMigration();
 *   }
 * }
 * 
 * @returns {Object} Object with t function for use in templates
 */
export const useI18nMigration = () => {
    // Get the composition API version
    const { t } = useI18n();

    // Return only what's needed in templates  
    return { t };
};

/**
 * Translates a string using the current locale - usable outside of components
 * @param {string} key - The translation key
 * @param {Object} options - Optional parameters for the translation
 * @returns {string} The translated string
 */
export const tc = (key, options = {}) => {
    // Check if we're in a test environment
    if (process.env.NODE_ENV === 'test' || (typeof global !== 'undefined' && global.jest)) {
        // In tests, just return the key
        return key;
    }

    try {
        const i18nInstance = getI18n();

        if (i18nInstance?.global?.t) {
            return i18nInstance.global.t(key, options);
        }
    } catch (err) {
        log.warn('Translation error', { key, error: err });
    }

    // Return key as fallback if translation fails
    return key;
};

// For backward compatibility
export default {
    get: getI18n
};
