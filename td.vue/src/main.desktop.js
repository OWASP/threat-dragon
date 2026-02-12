import 'mutationobserver-shim';
import Vue from 'vue';

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
import { TEMPLATE_SET_CONTENT_STORE_STATUS, TEMPLATE_SET_TEMPLATES } from './store/actions/template.js';

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


//request from electron to renderer with template store status and templates
window.electronAPI.onTemplatesResult((_event, result) => {
    console.debug('Templates result:', result);

    // Commit to store
    app.$store.commit(TEMPLATE_SET_CONTENT_STORE_STATUS, {
        status: result.status,
        canWrite: result.canWrite || false
    });
    app.$store.commit(TEMPLATE_SET_TEMPLATES, result.templates || []);
});

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

    if (Object.prototype.hasOwnProperty.call(jsonModel, 'modelError')) {
        app.$toast.error(app.$t('threatmodel.errors.' + jsonModel.modelError));
        return;
    }

    // schema errors are not fatal, and some formats are not supported yet
    if(!schema.isV2(jsonModel)){
        if (schema.isV1(jsonModel)) {
            console.warn('Version 1.x file will be translated to V2 format');
            app.$toast.warning(app.$t('threatmodel.warnings.v1Translate'), { timeout: false });
        } else if (schema.isTmBom(jsonModel)) {
            jsonModel = openTmBom(jsonModel);
            console.debug('force re-selection of file name for TM-BOM');
            fileName = '';
            window.electronAPI.modelOpened(fileName);
        } else if (schema.isOtm(jsonModel)) {
            console.error('Convert OTM to dragon format not yet supported');
            app.$toast.error(app.$t('threatmodel.warnings.otmUnsupported'), { timeout: false });
            return;
        } else {
            console.warn('Model does not strictly match possible schemas: ' + JSON.stringify(schema.checkV2(jsonModel)));
            app.$toast.warning(app.$t('threatmodel.warnings.jsonSchema'));
        }
    }

    // this will fail if the threat model does not have a title in the summary
    try {
        params = Object.assign({}, app.$route.params, {
            threatmodel: jsonModel.summary.title
        });
    } catch (e) {
        app.$toast.error(app.$t('threatmodel.errors.invalidModel') + ' : ' + e.message);
        app.$router.push({ name: 'MainDashboard' }).catch(error => {
            if (error.name != 'NavigationDuplicated') {
                throw error;
            }
        });
        window.electronAPI.modelOpened('');
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

// advice from electron to renderer that the model has been printed
window.electronAPI.onPrintModelConfirmed((_event, fileName) =>  {
    console.debug('Print model confirmed for file : ' + fileName);
    app.$toast.success(app.$t('threatmodel.prompts.exported'));
});

// request from electron to renderer to provide the model data so that it can be saved
window.electronAPI.onSaveModelRequest((_event, fileName) =>  {
    console.debug('Save model request for file name : ' + fileName);
    app.$store.dispatch(tmActions.diagramApplied);
    app.$store.dispatch(tmActions.saveModel);
});

// advice from electron to renderer that the model has been saved
window.electronAPI.onSaveModelConfirmed((_event, fileName) =>  {
    console.debug('Save model confirmed for file : ' + fileName);
    app.$store.dispatch(tmActions.stash);
    app.$store.dispatch(tmActions.notModified);
    app.$toast.success(app.$t('threatmodel.prompts.saved'));
});
window.electronAPI.onImportTemplateSuccess((_event,message) =>  {
    console.debug('Template imported successfully');
    app.$toast.success(message);
});
window.electronAPI.onImportTemplateError((_event,message) =>  {
    console.debug('Template import failed');
    app.$toast.error(message);
});
window.electronAPI.onSaveModelFailed((_event, fileName, message) =>  {
    console.debug('Failed to save model file : ' + fileName);
    app.$toast.warning(message);
});

window.electronAPI.onFetchModelByIdResult((_event, result) => {
    console.debug('Fetch model by ID result:', result);
    
    // Load template (regenerates IDs and sets as current model)
    app.$store.dispatch(tmActions.templateLoad, {
        templateData: result.model
    });
    
    // Route to new threat model page
    const model = app.$store.state.threatmodel.data;
    const params = { threatmodel: model.summary.title };
    app.$router.push({ name: `${providerNames.desktop}ThreatModel`, params });
});

window.electronAPI.onExportTemplateSuccess((_event, message) => {
    console.debug('Template exported successfully');
    app.$toast.success(message);
});

window.electronAPI.onExportTemplateError((_event, message) => {
    console.debug('Template export failed');
    app.$toast.error(message);
});

window.electronAPI.onDeleteTemplateSuccess((_event, message) => {
    console.debug('Template deleted successfully');
    app.$toast.success(message);
}
);

window.electronAPI.onDeleteTemplateError((_event, message) => {
    console.debug('Template delete failed');
    app.$toast.error(message);
});

window.electronAPI.onUpdateTemplateSuccess((_event, message) => {
    console.debug('Template updated successfully');
    app.$toast.success(message);
});

window.electronAPI.onUpdateTemplateError((_event, message) => {
    console.debug('Template update failed');
    app.$toast.error(message);
});

window.electronAPI.onBootstrapTemplatesSuccess((_event, message) => {
    console.debug('Templates bootstrapped successfully');
    app.$toast.success(message);
});

window.electronAPI.onBootstrapTemplatesError((_event, message) => {
    console.debug('Templates bootstrap failed');
    app.$toast.error(message);
});

window.electronAPI.onSetTemplateFolderSuccess((_event, message) => {
    console.debug('Template folder set successfully');
    app.$toast.success(message);
});

window.electronAPI.onSetTemplateFolderError((_event, message) => {
    console.debug('Template folder setup failed');
    app.$toast.error(message);
});

const localAuth = () => {
    app.$store.dispatch(providerActions.selected, providerNames.desktop);
    app.$store.dispatch(authActions.setLocal);
};

const openTmBom = (jsonModel) => {
    console.warn('Convert TM-BOM to internal TD format');
    app.$toast.warning(app.$t('threatmodel.warnings.tmUnsupported'), { timeout: false });
    return tmBom.read(jsonModel);
};

const app = new Vue({
    router: router.get(),
    store: storeFactory.get(),
    render: h => h(App),
    i18n: i18nFactory.get()
}).$mount('#app');
