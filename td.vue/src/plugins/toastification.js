import Toast, { POSITION, createToastInterface, globalEventBus } from 'vue-toastification';

import 'vue-toastification/dist/index.css';

export const toastOptions = {
    position: POSITION.BOTTOM_LEFT,
    timeout: 3000
};

// v2 only provides inject(); set this on app.config.globalProperties so
// this.$toast and appProxy.$toast work
// TODO: Replace vue-toastification with another toast library that supports
// vue 3.  vue-toastification is no longer maintained.
export function installToastGlobalProperties(app, options) {
    const toast = createToastInterface({ eventBus: globalEventBus, ...options });
    app.config.globalProperties.$toast = toast;
}

export default Toast;
