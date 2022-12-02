import 'mutationobserver-shim';
import Vue from 'vue';

import App from './App.vue';
import i18nFactory from './i18n/index.js';
import router from './router/index.js';
import storeFactory from './store/index.js';

import './plugins/bootstrap-vue.js';
import './plugins/fontawesome-vue.js';
import './plugins/toastification.js';

import store from '@/store/index.js';
import tmActions from '@/store/actions/threatmodel.js';

Vue.config.productionTip = false;

window.electronAPI.onCloseModel((_event, fileName) =>  {
    // TODO check that any existing open model has not been modified
    console.debug('Closing model with file name : ' + fileName);
    store.get().dispatch(tmActions.clear);
    /* TODO router.get().push({ name: 'MainDashboard' });*/
    /*router.get().push('/dashboard');*/
});

window.electronAPI.onOpenModel((_event, fileName, jsonModel) =>  {
    // already checked that if there is an existing open model it has not been modified
    console.debug('Open model with file name : ' + fileName);
    store.get().dispatch(tmActions.update, { fileName: fileName });
    store.get().dispatch(tmActions.selected, jsonModel);
    /* TODO router.get().push({ name: 'localThreatModel' });*/
});

window.electronAPI.onNewModel((_event, fileName) =>  {
    // TODO check that any existing open model has not been modified
    console.debug('New model with file name : ' + fileName);
    store.get().dispatch(tmActions.update, { fileName: fileName });
    /* TODO router.get().push({ name: 'localNewThreatModel' });*/
});

new Vue({
    router: router.get(),
    store: storeFactory.get(),
    render: h => h(App),
    i18n: i18nFactory.get()
}).$mount('#app');
