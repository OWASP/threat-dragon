import { createI18n } from 'vue-i18n';

// the language codes follow
// Internet Engineering Task Force (IETF) Best Current Practice (BCP) 47
// ISO 639-1 language codes

import ar from './ar.js';
import de from './de.js';
import el from './el.js';
import en from './en.js';
import es from './es.js';
import fi from './fi.js';
import fr from './fr.js';
import hi from './hi.js';
import id from './id.js';
import ja from './ja.js';
import ms from './ms.js';
import pt from './pt.js';
import ptBr from './pt-br.js';
// hide RUS & UKR for now: import rus from './ru.js';
// hide RUS & UKR for now: import ukr from './uk.js';
import zh from './zh.js';

let i18nInstance = null;

const installLegacyCompat = (instance) => {
    if (typeof instance.t !== 'function') {
        instance.t = instance.global.t.bind(instance.global);
    }

    if (!Object.getOwnPropertyDescriptor(instance, 'locale')) {
        Object.defineProperty(instance, 'locale', {
            get() {
                return instance.global.locale;
            },
            set(value) {
                instance.global.locale = value;
            }
        });
    }

    return instance;
};

const get = () => {
    if (i18nInstance === null) {
        i18nInstance = createI18n({
            // Preserves Options API compatibility while migrating off deprecated tc/$tc.
            // Legacy mode is deprecated and will be removed in vue-i18n v12.
            // TODO: remove after refactoring i18n usage
            legacy: true,
            locale: 'eng',
            fallbackLocale: {
                pt: ['pt-BR'],
                default:  'en'
            },
            messages: { ar, de, el, en, es, fi, fr, hi, id, ja, ms, pt, 'pt-BR': ptBr, zh }
        });
        installLegacyCompat(i18nInstance);
    }
    return i18nInstance;
};

export const t = (...args) => get().global.t(...args);
export const tc = (key, ...args) => t(key, ...args);

export default {
    get
};
