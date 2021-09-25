import Vue from 'vue';
import VueI18n from 'vue-i18n';

import en from './en.js';

Vue.use(VueI18n);

let i18n = null;

const get = () => {
    if (i18n === null) {
        i18n = new VueI18n({
            locale: 'en',
            messages: {
                en
            }
        });
    }
    return i18n;
};

export const tc = (key) => get().tc(key);

export default {
    get
};
