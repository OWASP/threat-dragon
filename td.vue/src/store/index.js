import Vue from 'vue';
import Vuex from 'vuex';

import auth from './modules/auth.js';
import vuexPersist from '../plugins/vuex-persist.js';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        auth
    },
    plugins: [ vuexPersist.session.plugin ]
});
