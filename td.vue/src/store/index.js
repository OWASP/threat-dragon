import Vue from 'vue';
import Vuex from 'vuex';

import auth from './modules/auth.js';
import branch from './modules/branch.js';
import cell from './modules/cell.js';
import config from './modules/config.js';
import loader from './modules/loader.js';
import locale from './modules/locale.js';
import provider from './modules/provider.js';
import repo from './modules/repository.js';
import folder from './modules/folder.js';
import threatmodel from './modules/threatmodel.js';
import vuexPersist from '../plugins/vuex-persist.js';

let store = null;
const buildVersion = require('../../package.json').version;
const buildState = require('../../package.json').buildState;

const get = () => {
    if (store === null) {
        Vue.use(Vuex);
        store = new Vuex.Store({
            state: {
                packageBuildVersion: buildVersion,
                packageBuildState: buildState
            },
            modules: {
                auth,
                branch,
                cell,
                config,
                loader,
                locale,
                provider,
                repo,
                folder,
                threatmodel
            },
            plugins: [vuexPersist.session.plugin]
        });
    }

    return store;
};

export default {
    get
};
