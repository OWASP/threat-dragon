import 'mutationobserver-shim';
import Vue from 'vue';

import App from './App.vue';
import i18nFactory from './i18n/index.js';
import router from './router';
import storeFactory from './store';

import './plugins/bootstrap-vue';
import './plugins/fontawesome-vue';

Vue.config.productionTip = false;

new Vue({
    router,
    store: storeFactory.get(),
    render: h => h(App),
    i18n: i18nFactory.get()
}).$mount('#app');
