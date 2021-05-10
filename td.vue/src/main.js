import '@babel/polyfill';
import 'mutationobserver-shim';
import Vue from 'vue';

import App from './App.vue';
import router from './router';
import storeFactory from './store';

import './plugins/bootstrap-vue';
import './plugins/fontawesome-vue';

Vue.config.productionTip = false;

new Vue({
    router,
    store: storeFactory.get(),
    render: h => h(App)
}).$mount('#app');
