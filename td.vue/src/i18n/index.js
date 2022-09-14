import Vue from 'vue';
import VueI18n from 'vue-i18n';

import el from './el.js';
import en from './en.js';
import es from './es.js';
import cn from './cn.js';
import de from './de.js';
import fr from './fr.js';
import pt from './pt.js';
import ru from './ru.js';
import zh from './cn.js';

Vue.use(VueI18n);

let i18n = null;

const get = () => {
    if (i18n === null) {
        i18n = new VueI18n({
            locale: 'en',
            messages: {
                el,
                en,
                es,
                cn,
                de,
                fr,
                pt,
                ru,
                zh
            }
        });
    }
    return i18n;
};

export const tc = (key) => get().tc(key);

export default {
    get
};
