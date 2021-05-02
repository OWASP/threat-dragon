import Vue from 'vue';
import Vuex from 'vuex';

import provider from './modules/provider.js';
import vuexPersist from '../plugins/vuex-persist.js';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        provider
    },
    plugins: [ vuexPersist.session.plugin ]
});
