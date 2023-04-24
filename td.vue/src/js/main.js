import { createApp } from 'vue';
import App from '../App.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import '../plugins/fontawesome-vue.js';

import { createPinia, PiniaVuePlugin } from 'pinia';
import router from '@/router';
import { i18n } from '@/i18n';
import Toast, { POSITION } from 'vue-toastification';
import { BootstrapVue } from 'bootstrap-vue';
import 'vue-toastification/dist/index.css';

const app = createApp(App).component('font-awesome-icon', FontAwesomeIcon);
app.use(createPinia());
app.use(PiniaVuePlugin); // TODO: remove when Vue3 works
app.use(router);
app.use(i18n);
app.use(Toast, {
  position: POSITION.BOTTOM_LEFT,
});

app.use(BootstrapVue);

app.mount('#app');
