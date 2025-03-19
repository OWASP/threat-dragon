import { createApp } from 'vue'; // Vue 3 syntax
import App from './App.vue';
import i18nFactory from './i18n/index.js';
import router from './router/index.js';
import store from './store/index.js';
import bootstrapVue from './plugins/bootstrap-vue'; // BootstrapVue plugin
import fontAwesome from './plugins/fontawesome-vue'; // FontAwesome plugin
import GoogleSignInPlugin from 'vue3-google-signin';
import ToastPlugin from 'vue-toast-notification';  //updated Toast notifications setup
import Tooltip from 'primevue/tooltip';


const app = createApp(App);

// Attach plugins and dependencies
app.use(router); // Vue Router
app.use(store); // Vuex Store
app.use(i18nFactory.get()); // i18n (Internationalization)
app.use(bootstrapVue); // BootstrapVueNext plugin
app.use(fontAwesome); // FontAwesome plugin
app.use(GoogleSignInPlugin, {
  clientId: process.env.GOOGLE_CLIENT_ID,
});
app.use(ToastPlugin);
app.directive('tooltip', Tooltip);

// Mount the app
app.mount('#app');