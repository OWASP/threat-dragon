import 'mutationobserver-shim';
import { createApp } from 'vue';

import App from './App.vue';
import i18nFactory from './i18n/index.js';
import router from './router/index.js';
import storeFactory from './store/index.js';

import BootstrapVue from './plugins/bootstrap-vue.js';
import { FontAwesomeIcon } from './plugins/fontawesome-vue.js';
import Toast, { toastOptions, installToastGlobalProperties } from './plugins/toastification.js';

const app = createApp(App);
app.use(storeFactory.get());
app.use(router.get());
app.use(i18nFactory.get());
app.use(BootstrapVue);
app.use(Toast, toastOptions);
installToastGlobalProperties(app, toastOptions);
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');
