import Vue from 'vue';
import Toast, { POSITION, createToastInterface, globalEventBus } from 'vue-toastification';

import 'vue-toastification/dist/index.css';

export const toastOptions = {
    position: POSITION.BOTTOM_LEFT,
    timeout: 3000
};

// v2 only provides inject(); bind the existing global event bus so both
// Vue 2-style `Vue.$toast` callers and Vue 3 app globals share one instance.
// TODO: Replace vue-toastification with another toast library that supports
// vue 3.  vue-toastification is no longer maintained.
export function installToastGlobalProperties(app) {
    const toast = createToastInterface(globalEventBus);
    app.config.globalProperties.$toast = toast;
    Vue.$toast = toast;
}

export default Toast;
