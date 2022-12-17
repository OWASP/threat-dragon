import Vue from 'vue';
import VueI18n from 'vue-i18n';

// the language codes follow
// Internet Engineering Task Force (IETF) Best Current Practice (BCP) 47

import el from './el.js';
import en from './en.js';
import es from './es.js';
import de from './de.js';
import fr from './fr.js';
import hi from './hi.js';
import pt from './pt.js';
import ru from './ru.js';
import zh from './zh.js';

Vue.use(VueI18n);
let i18n = null;

const get = () => {
    if (i18n === null) {
        i18n = new VueI18n({
            locale: 'en',
            messages: { de, el, en, es, fr, hi, pt, ru, zh }
        });
    }
    return i18n;
};

export const tc = (key) => get().tc(key);

export default {
    get
};
