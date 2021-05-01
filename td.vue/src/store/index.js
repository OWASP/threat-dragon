import Vue from 'vue';
import Vuex from 'vuex';

import provider from './modules/provider.js';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        provider
    }
});
