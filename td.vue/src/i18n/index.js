import Vue from 'vue';
import VueI18n from 'vue-i18n';

import en from './en.js';
import test from './test.js';

Vue.use(VueI18n);

const get = () => new VueI18n({
    locale: 'en',
    messages: {
        en,
        test
    }
});

export default {
    get
};
