import Toast, { POSITION } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

// Export the plugin with options
export const toastificationPlugin = {
    install(app) {
        app.use(Toast, {
            position: POSITION.BOTTOM_LEFT
        });
    },
};