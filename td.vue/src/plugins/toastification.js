import Vue from 'vue';
import Toast, { POSITION } from 'vue-toastification';

import 'vue-toastification/dist/index.css';

Vue.use(Toast, {
    position: POSITION.BOTTOM_LEFT,
    timeout: 3000
});
