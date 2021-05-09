import Vue from 'vue';
import Vuex from 'vuex';

import auth from './modules/auth.js';
import branch from './modules/branch.js';
import provider from './modules/provider.js';
import repo from './modules/repository.js';
import threatmodel from './modules/threatmodel.js';
import vuexPersist from '../plugins/vuex-persist.js';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        auth,
        branch,
        provider,
        repo,
        threatmodel
    },
    plugins: [ vuexPersist.session.plugin ]
});
