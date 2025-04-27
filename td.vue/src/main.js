import { createApp } from 'vue'; // Vue 3 syntax
import App from './App.vue';
import i18nFactory from './i18n/index.js';
import router from './router/index.js';
import { store } from './store/index.js';
import bootstrapVueNext from './plugins/bootstrap-vue-next'; // Bootstrap-Vue-Next plugin for Vue 3
import fontAwesome from './plugins/fontawesome-vue'; // FontAwesome plugin
import { toastNotificationPlugin } from './plugins/toast-notification.js';
import Tooltip from 'primevue/tooltip';
import { isElectronMode } from './utils/environment';
// CSS is already included via link tag in index.html
// Don't try to import it directly to avoid webpack errors
import configActions from './store/actions/config.js';
import { AUTH_SET_JWT } from './store/actions/auth.js';
import { PROVIDER_SELECTED } from './store/actions/provider.js';
import logger from './utils/logger.js';
import './styles/stencil-custom.css'; // Import custom stencil styles

// Create a context-specific logger
const log = logger.getLogger('main');
// Add support for passive event listeners with appropriate options
import passiveEventsSupport from 'passive-events-support/dist/main.js';
// In the web version, the module is imported directly and we need to check if configure exists
if (passiveEventsSupport && typeof passiveEventsSupport.configure === 'function') {
    passiveEventsSupport.configure({ strict: false, capture: false });
}

// Check if we're in web-only mode
const isWebOnly = process.env.VUE_APP_WEB_ONLY === 'true';

// Create Vue app
const app = createApp(App);

// Attach plugins and dependencies
app.use(router); // Vue Router
app.use(store); // Vuex Store
app.use(i18nFactory.get()); // i18n (Internationalization)
app.use(bootstrapVueNext); // Bootstrap-Vue-Next plugin
app.use(fontAwesome); // FontAwesome plugin

// Initialize toast notification plugin
app.use(toastNotificationPlugin, {
    position: 'top-right',
    duration: 3000
});

app.directive('tooltip', Tooltip);

// Make app available globally for components that need it during the transition to Composition API
window._vueApp = app;

// Try to restore auth state from session storage before mounting the app
try {
    log.debug('Checking session storage for auth state');
    const sessionState = sessionStorage.getItem('td.vuex');
    if (sessionState) {
        const state = JSON.parse(sessionState);
        
        // Check if we have auth data in session storage
        if (state.auth && state.auth.user && state.auth.user.username) {
            log.info('Found auth data in session storage, attempting to restore');
            
            // If we have a provider in session storage, restore it
            if (state.provider && state.provider.selected) {
                log.info('Restoring provider from session storage:', {
                    provider: state.provider.selected
                });
                
                // Dispatch action to select provider
                store.dispatch(PROVIDER_SELECTED, state.provider.selected)
                    .then(() => {
                        log.info('Provider restored successfully');
                    })
                    .catch(err => {
                        log.error('Error restoring provider:', { error: err });
                    });
            }
            
            // If we have JWT data, restore it
            if (state.auth.jwt && state.auth.refreshToken) {
                log.info('Restoring JWT from session storage');
                
                // Dispatch action to set JWT
                store.dispatch(AUTH_SET_JWT, {
                    accessToken: state.auth.jwt,
                    refreshToken: state.auth.refreshToken
                })
                    .then(() => {
                        log.info('JWT restored successfully');
                    })
                    .catch(err => {
                        log.error('Error restoring JWT:', { error: err });
                    });
            }
        }
    }
} catch (err) {
    log.error('Error accessing session storage:', { error: err });
}

// Mount the app
app.mount('#app');

// Log the build mode
if (isWebOnly) {
    log.info('Running in web-only mode');
}

// Fetch config (this will set appropriate values for desktop/web modes)
store.dispatch(configActions.fetch).then(() => {
    // Only import and initialize Google Sign-In in web mode and if Google auth is enabled
    if ((!isElectronMode() || isWebOnly) && store.state.config?.config?.googleEnabled) {
        log.info('Google auth is enabled, initializing Google Sign-In plugin');
        import('vue3-google-signin').then((GoogleSignInModule) => {
            const GoogleSignInPlugin = GoogleSignInModule.default;
            app.use(GoogleSignInPlugin, {
                clientId: process.env.VUE_APP_GOOGLE_CLIENT_ID
            });
            log.info('Google Sign-In plugin initialized');
        });
    } else {
        log.info(
            'Google auth is not enabled or running in desktop mode, skipping Google Sign-In plugin'
        );
    }
});
