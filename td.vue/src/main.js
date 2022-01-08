import 'mutationobserver-shim';
import Vue from 'vue';

import App from './App.vue';
import i18nFactory from './i18n/index.js';
import router from './router/index.js';
import storeFactory from './store/index.js';

import './plugins/bootstrap-vue.js';
import './plugins/fontawesome-vue.js';
import './plugins/toastification.js';

Vue.config.productionTip = false;

new Vue({
    router: router.get(),
    store: storeFactory.get(),
    render: h => h(App),
    i18n: i18nFactory.get()
}).$mount('#app');
