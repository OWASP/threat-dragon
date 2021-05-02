import Vue from 'vue';
import Vuex from 'vuex';

import datasource from './modules/datasource.js';
import vuexPersist from '../plugins/vuex-persist.js';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        datasource
    },
    plugins: [ vuexPersist.session.plugin ]
});
