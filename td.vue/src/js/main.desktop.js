import 'mutationobserver-shim';
import Vue from 'vue';

import App from '../App.vue';
import i18nFactory from '../i18n';

import router from '../router';
import { providerNames } from '../service/provider/providers.js';

import storeFactory from './stores/index.js';
import authActions from './stores/actions/auth.js';
import providerActions from './stores/actions/provider.js';
import threatmodelActions from './stores/actions/threatmodel.js';

import '../plugins/fontawesome-vue.js';

// informing renderer that desktop menu shell has closed the model
window.electronAPI.onCloseModel((_event, fileName) =>  {
  console.warn('TODO check that any existing open model has not been modified');
  // getConfirmModal();
  console.debug('Closing model with file name : ' + fileName);
  app.$store.dispatch(threatmodelActions.clear);
  localAuth();
  app.$router.push({ name: 'MainDashboard' }).catch(error => {
    if (error.name != 'NavigationDuplicated') {
      throw error;
    }
  });
});

// request from desktop menu shell -> renderer to save the model
window.electronAPI.onSaveModel((_event, fileName) =>  {
  console.debug('Save model for file name : ' + fileName);
  app.$store.dispatch(threatmodelActions.save);
});

// informing renderer that desktop menu shell is providing new model cntents
window.electronAPI.onOpenModel((_event, fileName, jsonModel) =>  {
  // already checked that any existing open model has not been modified
  console.debug('Open model with file name : ' + fileName);
  let params;
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
  app.$store.dispatch(threatmodelActions.update, { fileName: fileName });
  app.$store.dispatch(threatmodelActions.selected, jsonModel);
  localAuth();
  app.$router.push({ name: `${providerNames.local}ThreatModel`, params });
});

// request from desktop menu shell -> renderer to start a new model
window.electronAPI.onNewModel((_event, fileName) =>  {
  console.warn('TODO check that any existing open model has not been modified');
  // getConfirmModal();
  console.debug('New model with file name : ' + fileName);
  app.$store.dispatch(threatmodelActions.update, { fileName: fileName });
  localAuth();
  app.$router.push({ name: `${providerNames.local}NewThreatModel` });
});

const localAuth = () => {
  app.$store.dispatch(providerActions.selected, providerNames.local);
  app.$store.dispatch(authActions.setLocal);
};

const app = new Vue({
  router: router.get(),
  store: storeFactory.get(),
  render: h => h(App),
  i18n: i18nFactory.get()
}).$mount('#app');
