import 'mutationobserver-shim';
import Vue from 'vue';
import { setPageTitle } from './utils/title.js';

import App from './App.vue';
import i18nFactory from './i18n/index.js';
import router from './router/index.js';
import storeFactory from './store/index.js';

import './plugins/bootstrap-vue.js';
import './plugins/fontawesome-vue.js';
import './plugins/toastification.js';

Vue.config.productionTip = false;

// Router
const routerInstance = router.get();
const storeInstance = storeFactory.get();

// --- Web Title Sync Patch ---

// 1. Watch Vuex for model title changes
storeInstance.watch(
    (state) => state.threatmodel?.data?.summary?.title,
    (newTitle) => {
        if (newTitle) {
            setPageTitle(newTitle);
        }
    }
);

// 2. Reset title when returning home/dashboard
routerInstance.afterEach((to) => {
    if (to.name === 'HomePage' || to.name === 'MainDashboard') {
        setPageTitle();
    }
});

new Vue({
    router: router.get(),
    store: storeFactory.get(),
    render: h => h(App),
    i18n: i18nFactory.get()
}).$mount('#app');
