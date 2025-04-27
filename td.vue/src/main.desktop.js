import 'mutationobserver-shim';
import { createApp } from 'vue';
import App from './App.vue';
import i18nFactory, { tc } from './i18n/index.js';
import router from './router/index.js';
import { providerNames } from './service/provider/providers.js';
import openThreatModel from './service/otm/openThreatModel.js';
import { isValidOTM, isValidSchema } from './service/schema/ajv';
import storeFactory from './store/index.js';
import authActions from './store/actions/auth.js';
import providerActions from './store/actions/provider.js';
import tmActions from './store/actions/threatmodel.js';
import { CONFIG_LOADED } from './store/actions/config.js';

// Import plugins
import bootstrapVueNext from './plugins/bootstrap-vue-next.js'; // Bootstrap-Vue-Next plugin for Vue 3
import './plugins/fontawesome-vue.js';
import toastNotification from './plugins/toast-notification.js';
import DesktopAuthPlugin from './plugins/desktop-auth.js'; // Custom desktop authentication plugin
import ConfirmationModal from './components/ConfirmationModal.vue';

// Log startup for debugging
console.log('Desktop app starting initialization with desktop authentication');

// Create Vue 3 app
const vueApp = createApp(App);

// Log explicit initialization
console.log('Creating Vue app instance');

// Force electron mode flag
window.isElectronMode = true;

// Add plugins
vueApp.use(router.get());
const store = storeFactory.get();
vueApp.use(store);
vueApp.use(i18nFactory.get());
vueApp.use(bootstrapVueNext); // Add Bootstrap plugin directly
vueApp.use(toastNotification); // Add toast notifications
vueApp.use(DesktopAuthPlugin); // Add Desktop authentication plugin

// Set desktop configuration explicitly
store.commit(CONFIG_LOADED, {
    config: {
        githubEnabled: false,
        googleEnabled: false,
        gitlabEnabled: false,
        bitbucketEnabled: false,
        localEnabled: true,
        desktopEnabled: true
    }
});

// Configure router for desktop mode
console.log('Router configured for desktop mode');

// Set up Vue globals for desktop mode
console.log('Running in Electron desktop mode');

// Add error logging
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

// Mount the app
const app = vueApp.mount('#app');

// Make app available globally for components that need it during the transition to Composition API
window._vueApp = vueApp;

// Log that the app has mounted
console.log('App mounted successfully!');

// Register ConfirmationModal component globally
vueApp.component('ConfirmationModal', ConfirmationModal);

// Create a div for modal mounting and add it to the DOM
const modalContainer = document.createElement('div');
modalContainer.id = 'confirm-modal-container';
document.body.appendChild(modalContainer);

// Create and mount the confirmation modal
const modalApp = createApp({
    data() {
        return {
            title: 'Confirm',
            message: 'Are you sure?',
            okTitle: 'OK',
            cancelTitle: 'Cancel'
        };
    },
    template: `
    <confirmation-modal 
      ref="confirmModal"
      :title="title"
      :message="message"
      :ok-title="okTitle"
      :cancel-title="cancelTitle"
    />
  `
});

// Use the same bootstrapVueNext instance for the modal app
modalApp.use(bootstrapVueNext);

// Mount the modal app
const modalInstance = modalApp.mount('#confirm-modal-container');

// Use standardized translation helper
const safeTranslate = (key, defaultText) => {
    return tc(key) || defaultText;
};

// Function to show confirmation dialog
const getConfirmModal = async () => {
    modalInstance.message = safeTranslate(
        'forms.discardMessage',
        'Are you sure you want to discard your changes?'
    );
    modalInstance.title = safeTranslate('forms.confirm', 'Confirm');
    modalInstance.okTitle = safeTranslate('forms.ok', 'OK');
    modalInstance.cancelTitle = safeTranslate('forms.cancel', 'Cancel');

    try {
        return modalInstance.$refs.confirmModal.show();
    } catch (error) {
        console.error('Error showing confirmation modal:', error);
        return confirm(modalInstance.message); // Fallback to browser confirm
    }
};

// request from electron to renderer to close the application
window.electronAPI.onCloseAppRequest(async () => {
    console.debug('Close application request');
    const store = app.$store || vueApp.config.globalProperties.$store;
    if (!store.getters.modelChanged || (await getConfirmModal())) {
        console.debug('Closing application');
        // send request back to electron server to close the application
        window.electronAPI.appClose();
    }
});

// request from electron to renderer to close the model
window.electronAPI.onCloseModelRequest(async (_, fileName) => {
    console.debug('Close model request for file name : ' + fileName);
    const store = app.$store || vueApp.config.globalProperties.$store;
    const appRouter = app.$router || router.get();

    if (!store.getters.modelChanged || (await getConfirmModal())) {
        console.debug('Closing model and diagram');
        store.dispatch(tmActions.diagramClosed);
        localAuth();
        appRouter.push({ name: 'MainDashboard' }).catch((error) => {
            if (error.name != 'NavigationDuplicated') {
                throw error;
            }
        });
        // store clear action sends modelClosed notification back to electron server
        store.dispatch(tmActions.clear);
    }
});

// request from electron to renderer to start a new model
window.electronAPI.onNewModelRequest(async (_, fileName) => {
    console.debug('New model request  with file name : ' + fileName);
    const store = app.$store || vueApp.config.globalProperties.$store;
    const appRouter = app.$router || router.get();

    if (!store.getters.modelChanged || (await getConfirmModal())) {
        console.debug('Opening new model');
        store.dispatch(tmActions.diagramClosed);
        store.dispatch(tmActions.update, { fileName: fileName });
        localAuth();
        appRouter.push({ name: `${providerNames.desktop}NewThreatModel` });
        // send modelOpened notification of new model back to electron server
        window.electronAPI.modelOpened(fileName);
    }
});

// provide renderer with model contents from electron
window.electronAPI.onOpenModel((_, fileName, jsonModel) => {
    console.debug('Open model with file name : ' + fileName);
    const store = app.$store || vueApp.config.globalProperties.$store;
    const appRouter = app.$router || router.get();
    const currentRoute = appRouter.currentRoute.value; // Vue 3 router uses .value

    // Safe access to i18n and toast
    let i18nInstance, toastInstance;
    try {
        i18nInstance = app.$i18n || vueApp.config.globalProperties.$i18n;
    } catch (e) {
        console.warn('Could not access i18n instance:', e);
        i18nInstance = null;
    }

    try {
        toastInstance = app.$toast || vueApp.config.globalProperties.$toast || window.$toast;
    } catch (e) {
        console.warn('Could not access toast instance:', e);
        toastInstance = {
            error: (msg) => console.error('Toast error:', msg),
            warning: (msg) => console.warn('Toast warning:', msg),
            success: (msg) => console.log('Toast success:', msg)
        };
    }

    let params;
    // check for schema errors
    if (!isValidSchema(jsonModel)) {
        console.warn('Invalid threat model');
    } else if (isValidOTM(jsonModel)) {
        // if threat model is in OTM format then convert OTM to dragon format
        jsonModel = openThreatModel.convertOTMtoTD(jsonModel);
    }

    // this will fail if the threat model does not have a title in the summary
    try {
        params = Object.assign({}, currentRoute.params, {
            threatmodel: jsonModel.summary.title
        });
    } catch (e) {
        let errorMessage;
        try {
            errorMessage =
                i18nInstance && typeof i18nInstance.t === 'function'
                    ? i18nInstance.t('threatmodel.errors.invalidJson') + ' : ' + e.message
                    : 'Invalid JSON: ' + e.message;
        } catch (translationError) {
            console.warn('Translation error:', translationError);
            errorMessage = 'Invalid JSON: ' + e.message;
        }

        if (toastInstance) toastInstance.error(errorMessage);
        appRouter.push({ name: 'HomePage' }).catch((error) => {
            if (error.name != 'NavigationDuplicated') {
                throw error;
            }
        });
        return;
    }
    store.dispatch(tmActions.update, { fileName: fileName });
    store.dispatch(tmActions.selected, jsonModel);
    localAuth();
    appRouter.push({ name: `${providerNames.desktop}ThreatModel`, params }).catch((error) => {
        if (error.name != 'NavigationDuplicated') {
            throw error;
        }
    });
});

// request from electron to renderer to provide new model contents
window.electronAPI.onOpenModelRequest(async (_, fileName) => {
    console.debug('Open request for model file name : ' + fileName);
    const store = app.$store || vueApp.config.globalProperties.$store;

    if (!store.getters.modelChanged || (await getConfirmModal())) {
        console.debug('Confirm model can be opened');
        window.electronAPI.modelOpenConfirmed(fileName);
    }
});

// request from electron to renderer to print the model report
window.electronAPI.onPrintModelRequest(async (_, format) => {
    console.debug('Print report request for model using format : ' + format);
    const store = app.$store || vueApp.config.globalProperties.$store;
    const appRouter = app.$router || router.get();

    if (!store.getters.modelChanged || (await getConfirmModal())) {
        console.debug('Printing model as ' + format);
        store.dispatch(tmActions.diagramClosed);
        store.dispatch(tmActions.restore);
        store.dispatch(tmActions.notModified);
        localAuth();
        appRouter.push({ name: `${providerNames.desktop}Report` }).catch((error) => {
            if (error.name != 'NavigationDuplicated') {
                throw error;
            }
        });
        // send modelPrint notification back to electron server along with format
        window.electronAPI.modelPrint(format);
    }
});

// request from electron to renderer to provide the model data so that it can be saved
window.electronAPI.onSaveModelRequest((_, fileName) => {
    console.debug('Save model request for file name : ' + fileName);
    const store = app.$store || vueApp.config.globalProperties.$store;

    store.dispatch(tmActions.diagramApplied);
    store.dispatch(tmActions.saveModel);
});

const localAuth = () => {
    const store = app.$store || vueApp.config.globalProperties.$store;

    store.dispatch(providerActions.selected, providerNames.desktop);
    store.dispatch(authActions.setLocal);
};
