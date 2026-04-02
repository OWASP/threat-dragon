import { createI18n } from 'vue-i18n';

// the language codes follow
// Internet Engineering Task Force (IETF) Best Current Practice (BCP) 47
// using codes from ISO 639-2

import ara from './ar.js';
import deu from './de.js';
import ell from './el.js';
import eng from './en.js';
import fin from './fi.js';
import fra from './fr.js';
import hin from './hi.js';
import ind from './id.js';
import jpn from './ja.js';
import msa from './ms.js';
import por from './pt.js';
// hide RUS & UKR for now: import rus from './ru.js';
import spa from './es.js';
// hide RUS & UKR for now: import ukr from './uk.js';
import zho from './zh.js';

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
            // Preserves Options API and get().global.tc() compatibility with vue-i18n v8
            // Legacy mode is deprecated and will be removed in vue-i18n v12.
            // TODO: remove after refactoring i18n usage
            legacy: true,
            locale: 'eng',
            messages: { ara, deu, ell, eng, spa, fin, fra, hin, ind, jpn, msa, por, zho }
        });
        installLegacyCompat(i18nInstance);
    }
    return i18nInstance;
};

export const tc = (key) => get().global.tc(key);

export default {
    get
};
