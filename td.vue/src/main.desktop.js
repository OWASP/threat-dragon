import 'mutationobserver-shim';
import { createApp } from 'vue';

import App from './App.vue';
import i18nFactory from './i18n/index.js';

import router from './router/index.js';
import { providerNames } from './service/provider/providers.js';
import tmBom from './service/migration/tmBom/tmBom';

import schema from './service/schema/ajv';
import storeFactory from './store/index.js';
import authActions from './store/actions/auth.js';
import providerActions from './store/actions/provider.js';
import tmActions from './store/actions/threatmodel.js';

import BootstrapVue from './plugins/bootstrap-vue.js';
import { FontAwesomeIcon } from './plugins/fontawesome-vue.js';
import Toast, { toastOptions, installToastGlobalProperties } from './plugins/toastification.js';

let appProxy;

const getConfirmModal = () => {
    return appProxy.$bvModal.msgBoxConfirm(appProxy.$t('forms.discardMessage'), {
        title: appProxy.$t('forms.discardTitle'),
        okVariant: 'danger',
        okTitle: appProxy.$t('forms.ok'),
        cancelTitle: appProxy.$t('forms.cancel'),
        hideHeaderClose: true,
        centered: true
    });
};

// request from electron to renderer to close the application
window.electronAPI.onCloseAppRequest(async (_event) =>  { // eslint-disable-line no-unused-vars
    console.debug('Close application request');
    if (!appProxy.$store.getters.modelChanged || await getConfirmModal()) {
        console.debug('Closing application');
        // send request back to electron server to close the application
        window.electronAPI.appClose();
    }
});

// request from electron to renderer to close the model
window.electronAPI.onCloseModelRequest(async (_event, fileName) =>  {
    console.debug('Close model request for file name : ' + fileName);
    if (!appProxy.$store.getters.modelChanged || await getConfirmModal()) {
        console.debug('Closing model and diagram');
        appProxy.$store.dispatch(tmActions.diagramClosed);
        localAuth();
        appProxy.$router.push({ name: 'MainDashboard' }).catch(error => {
            if (error.name != 'NavigationDuplicated') {
                throw error;
            }
        });
        // store clear action sends modelClosed notification back to electron server
        appProxy.$store.dispatch(tmActions.clear);
    }
});

// request from electron to renderer to start a new model
window.electronAPI.onNewModelRequest(async (_event, fileName) =>  {
    console.debug('New model request  with file name : ' + fileName);
    if (!appProxy.$store.getters.modelChanged || await getConfirmModal()) {
        console.debug('Opening new model');
        appProxy.$store.dispatch(tmActions.diagramClosed);
        appProxy.$store.dispatch(tmActions.update, { fileName: fileName });
        localAuth();
        appProxy.$router.push({ name: `${providerNames.desktop}NewThreatModel` });
        // send modelOpened notification of new model back to electron server
        window.electronAPI.modelOpened(fileName);
    }
});

// provide renderer with model contents from electron
window.electronAPI.onOpenModel((_event, fileName, jsonModel) =>  {
    console.debug('Open model with file name : ' + fileName);
    let params;

    if (Object.prototype.hasOwnProperty.call(jsonModel, 'modelError')) {
        appProxy.$toast.error(appProxy.$t('threatmodel.errors.' + jsonModel.modelError));
        return;
    }

    // schema errors are not fatal, and some formats are not supported yet
    if(!schema.isV2(jsonModel)){
        if (schema.isV1(jsonModel)) {
            console.warn('Version 1.x file will be translated to V2 format');
            appProxy.$toast.warning(appProxy.$t('threatmodel.warnings.v1Translate'), { timeout: false });
        } else if (schema.isTmBom(jsonModel)) {
            jsonModel = openTmBom(jsonModel);
            console.debug('force re-selection of file name for TM-BOM');
            fileName = '';
            window.electronAPI.modelOpened(fileName);
        } else if (schema.isOtm(jsonModel)) {
            console.error('Convert OTM to dragon format not yet supported');
            appProxy.$toast.error(appProxy.$t('threatmodel.warnings.otmUnsupported'), { timeout: false });
            return;
        } else {
            console.warn('Model does not strictly match possible schemas: ' + JSON.stringify(schema.checkV2(jsonModel)));
            appProxy.$toast.warning(appProxy.$t('threatmodel.warnings.jsonSchema'));
        }
    }

    // this will fail if the threat model does not have a title in the summary
    try {
        params = Object.assign({}, appProxy.$route.params, {
            threatmodel: jsonModel.summary.title
        });
    } catch (e) {
        appProxy.$toast.error(appProxy.$t('threatmodel.errors.invalidModel') + ' : ' + e.message);
        appProxy.$router.push({ name: 'MainDashboard' }).catch(error => {
            if (error.name != 'NavigationDuplicated') {
                throw error;
            }
        });
        window.electronAPI.modelOpened('');
        return;
    }

    appProxy.$store.dispatch(tmActions.update, { fileName: fileName });
    appProxy.$store.dispatch(tmActions.selected, jsonModel);
    localAuth();
    appProxy.$router.push({ name: `${providerNames.desktop}ThreatModel`, params }).catch(error => {
        if (error.name != 'NavigationDuplicated') {
            throw error;
        }
    });
});

// request from electron to renderer to provide new model contents
window.electronAPI.onOpenModelRequest(async (_event, fileName) =>  {
    console.debug('Open request for model file name : ' + fileName);
    if (!appProxy.$store.getters.modelChanged || await getConfirmModal()) {
        console.debug('Confirm model can be opened');
        window.electronAPI.modelOpenConfirmed(fileName);
    }
});

// request from electron to renderer to print the model report
window.electronAPI.onPrintModelRequest(async (_event, format) =>  {
    console.debug('Print report request for model using format : ' + format);
    if (!appProxy.$store.getters.modelChanged || await getConfirmModal()) {
        console.debug('Printing model as ' + format);
        appProxy.$store.dispatch(tmActions.diagramClosed);
        appProxy.$store.dispatch(tmActions.restore);
        appProxy.$store.dispatch(tmActions.notModified);
        localAuth();
        appProxy.$router.push({ name: `${providerNames.desktop}Report` }).catch(error => {
            if (error.name != 'NavigationDuplicated') {
                throw error;
            }
        });
        // send modelPrint notification back to electron server along with format
        window.electronAPI.modelPrint(format);
    }
});

// advice from electron to renderer that the model has been printed
window.electronAPI.onPrintModelConfirmed((_event, fileName) =>  {
    console.debug('Print model confirmed for file : ' + fileName);
    appProxy.$toast.success(appProxy.$t('threatmodel.prompts.exported'));
});

// request from electron to renderer to provide the model data so that it can be saved
window.electronAPI.onSaveModelRequest((_event, fileName) =>  {
    console.debug('Save model request for file name : ' + fileName);
    appProxy.$store.dispatch(tmActions.diagramApplied);
    appProxy.$store.dispatch(tmActions.saveModel);
});

// advice from electron to renderer that the model has been saved
window.electronAPI.onSaveModelConfirmed((_event, fileName) =>  {
    console.debug('Save model confirmed for file : ' + fileName);
    appProxy.$store.dispatch(tmActions.stash);
    appProxy.$store.dispatch(tmActions.notModified);
    appProxy.$toast.success(appProxy.$t('threatmodel.prompts.saved'));
});

window.electronAPI.onSaveModelFailed((_event, fileName, message) =>  {
    console.debug('Failed to save model file : ' + fileName);
    appProxy.$toast.warning(message);
});

const localAuth = () => {
    appProxy.$store.dispatch(providerActions.selected, providerNames.desktop);
    appProxy.$store.dispatch(authActions.setLocal);
};

const openTmBom = (jsonModel) => {
    console.warn('Convert TM-BOM to internal TD format');
    appProxy.$toast.warning(appProxy.$t('threatmodel.warnings.tmUnsupported'), { timeout: false });
    return tmBom.read(jsonModel);
};

const app = createApp(App);
app.use(storeFactory.get());
app.use(router.get());
app.use(i18nFactory.get());
app.use(BootstrapVue);
app.use(Toast, toastOptions);
installToastGlobalProperties(app, toastOptions);
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');
appProxy = app.config.globalProperties;
