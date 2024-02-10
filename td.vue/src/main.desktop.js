import 'mutationobserver-shim';
import Vue from 'vue';

import App from './App.vue';
import i18nFactory from './i18n/index.js';

import router from './router/index.js';
import { providerNames } from './service/provider/providers.js';

import openThreatModel from './service/otm/openThreatModel.js';
import { isValidOTM, isValidSchema } from './service/schema/ajv';
import storeFactory from './store/index.js';
import authActions from './store/actions/auth.js';
import providerActions from './store/actions/provider.js';
import tmActions from './store/actions/threatmodel.js';

import './plugins/bootstrap-vue.js';
import './plugins/fontawesome-vue.js';
import './plugins/toastification.js';

Vue.config.productionTip = false;

const getConfirmModal = () => {
    return app.$bvModal.msgBoxConfirm(app.$t('forms.discardMessage'), {
        title: app.$t('forms.discardTitle'),
        okVariant: 'danger',
        okTitle: app.$t('forms.ok'),
        cancelTitle: app.$t('forms.cancel'),
        hideHeaderClose: true,
        centered: true
    });
};

// request from electron to renderer to close the application
window.electronAPI.onCloseAppRequest(async (_event) =>  { // eslint-disable-line no-unused-vars
    console.debug('Close application request');
    if (!app.$store.getters.modelChanged || await getConfirmModal()) {
        console.debug('Closing application');
        // send request back to electron server to close the application
        window.electronAPI.appClose();
    }
});

// request from electron to renderer to close the model
window.electronAPI.onCloseModelRequest(async (_event, fileName) =>  {
    console.debug('Close model request for file name : ' + fileName);
    if (!app.$store.getters.modelChanged || await getConfirmModal()) {
        console.debug('Closing model and diagram');
        app.$store.dispatch(tmActions.diagramClosed);
        localAuth();
        app.$router.push({ name: 'MainDashboard' }).catch(error => {
            if (error.name != 'NavigationDuplicated') {
                throw error;
            }
        });
        // store clear action sends modelClosed notification back to electron server
        app.$store.dispatch(tmActions.clear);
    }
});

// request from electron to renderer to start a new model
window.electronAPI.onNewModelRequest(async (_event, fileName) =>  {
    console.debug('New model request  with file name : ' + fileName);
    if (!app.$store.getters.modelChanged || await getConfirmModal()) {
        console.debug('Opening new model');
        app.$store.dispatch(tmActions.diagramClosed);
        app.$store.dispatch(tmActions.update, { fileName: fileName });
        localAuth();
        app.$router.push({ name: `${providerNames.desktop}NewThreatModel` });
        // send modelOpened notification of new model back to electron server
        window.electronAPI.modelOpened(fileName);
    }
});

// provide renderer with model contents from electron
window.electronAPI.onOpenModel((_event, fileName, jsonModel) =>  {
    console.debug('Open model with file name : ' + fileName);
    let params;
    // check for schema errors
    if(!isValidSchema(jsonModel)){
        console.warn('Invalid threat model');
    } else if (isValidOTM(jsonModel)) {
        // if threat model is in OTM format then convert OTM to dragon format
        jsonModel = openThreatModel.convertOTMtoTD(jsonModel);
    }

    // this will fail if the threat model does not have a title in the summary
    try {
        params = Object.assign({}, app.$route.params, {
            threatmodel: jsonModel.summary.title
        });
    } catch (e) {
        app.$toast.error(app.$t('threatmodel.errors.invalidJson') + ' : ' + e.message);
        app.$router.push({ name: 'HomePage' }).catch(error => {
            if (error.name != 'NavigationDuplicated') {
                throw error;
            }
        });
        return;
    }
    app.$store.dispatch(tmActions.update, { fileName: fileName });
    app.$store.dispatch(tmActions.selected, jsonModel);
    localAuth();
    app.$router.push({ name: `${providerNames.desktop}ThreatModel`, params }).catch(error => {
        if (error.name != 'NavigationDuplicated') {
            throw error;
        }
    });
});

// request from electron to renderer to provide new model contents
window.electronAPI.onOpenModelRequest(async (_event, fileName) =>  {
    console.debug('Open request for model file name : ' + fileName);
    if (!app.$store.getters.modelChanged || await getConfirmModal()) {
        console.debug('Confirm model can be opened');
        window.electronAPI.modelOpenConfirmed(fileName);
    }
});

// request from electron to renderer to print the model report
window.electronAPI.onPrintModelRequest(async (_event, format) =>  {
    console.debug('Print report request for model using format : ' + format);
    if (!app.$store.getters.modelChanged || await getConfirmModal()) {
        console.debug('Printing model as ' + format);
        app.$store.dispatch(tmActions.diagramClosed);
        app.$store.dispatch(tmActions.restore);
        app.$store.dispatch(tmActions.notModified);
        localAuth();
        app.$router.push({ name: `${providerNames.desktop}Report` }).catch(error => {
            if (error.name != 'NavigationDuplicated') {
                throw error;
            }
        });
        // send modelPrint notification back to electron server along with format
        window.electronAPI.modelPrint(format);
    }
});

// request from electron to renderer to provide the model data so that it can be saved
window.electronAPI.onSaveModelRequest((_event, fileName) =>  {
    console.debug('Save model request for file name : ' + fileName);
    app.$store.dispatch(tmActions.diagramApplied);
    app.$store.dispatch(tmActions.saveModel);
});

const localAuth = () => {
    app.$store.dispatch(providerActions.selected, providerNames.desktop);
    app.$store.dispatch(authActions.setLocal);
};

const app = new Vue({
    router: router.get(),
    store: storeFactory.get(),
    render: h => h(App),
    i18n: i18nFactory.get()
}).$mount('#app');
