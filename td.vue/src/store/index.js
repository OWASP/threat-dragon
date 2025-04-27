import { createStore } from 'vuex';

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
import ui from './modules/ui.js';
import vuexPersist from '../plugins/vuex-persist.js';

const buildVersion = require('../../package.json').version;
const buildState = require('../../package.json').buildState;

// Create the Vuex store using Vue 3's createStore API
const store = createStore({
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
        threatmodel,
        ui
    },
    plugins: [vuexPersist.session.plugin]
});

// Factory pattern for backward compatibility with existing code
// that uses store.get()
const storeFactory = {
    get() {
        return store;
    }
};

// Export both the store itself and the factory
export { storeFactory as default, store };
