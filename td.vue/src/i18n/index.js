import Vue from 'vue';
import VueI18n from 'vue-i18n';

// the language codes follow
// Internet Engineering Task Force (IETF) Best Current Practice (BCP) 47
// using codes from ISO 639-2

import ell from './el.js';
import eng from './en.js';
import spa from './es.js';
import deu from './de.js';
import fra from './fr.js';
import hin from './hi.js';
import por from './pt.js';
import rus from './ru.js';
import ukr from './uk.js';
import zho from './zh.js';

Vue.use(VueI18n);
let i18n = null;

const get = () => {
    if (i18n === null) {
        i18n = new VueI18n({
            locale: 'eng',
            messages: { deu, ell, eng, spa, fra, hin, por, rus, ukr, zho }
        });
    }
    return i18n;
};

export const tc = (key) => get().tc(key);

export default {
    get
};
