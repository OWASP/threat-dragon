import axios from 'axios';
import { AUTH_SET_JWT } from '@/store/actions/auth.js';
import { LOADER_FINISHED, LOADER_STARTED } from '@/store/actions/loader.js';
import router from '@/router/index.js';
import { store } from '@/store/index.js'; // Direct import of the store instance

import { tc } from '@/i18n/index.js';
import { useToast } from '@/plugins/toast-notification.js';
import logger from '@/utils/logger.js';

// Create a context-specific logger
const log = logger.getLogger('httpClient');

// Get translation using the standardized helper
const getTranslation = (key) => tc(key);

// Get toast using the standardized helper
const getToast = () => useToast();

// Determine the correct base URL based on environment
const getBaseUrl = () => {
    // Always use the same protocol as the current page to avoid mixed content errors
    const currentProtocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port ? `:${window.location.port}` : '';

    // In development mode, we might want to explicitly set the port
    if (process.env.NODE_ENV === 'development') {
        return `${currentProtocol}//${hostname}${port}`;
    }

    // In production, we'll either use the full URL or just a relative path
    // Using a relative path is safer as it automatically uses the current protocol and host
    return '';
};

const createClient = () => {
    const baseURL = getBaseUrl();
    log.debug('Creating HTTP client', { baseURL });

    const client = axios.create({
        baseURL
    });
    client.defaults.headers.common.Accept = 'application/json';
    client.defaults.headers.post['Content-Type'] = 'application/json';
    client.interceptors.request.use(
        (config) => {
            store.dispatch(LOADER_STARTED);

            if (store.state.auth.jwt) {
                config.headers.authorization = `Bearer ${store.state.auth.jwt}`;
            }

            return config;
        },
        (err) => {
            log.error('Request error', { error: err });
            store.dispatch(LOADER_FINISHED);
            return Promise.reject(err);
        }
    );

    client.interceptors.response.use(
        (resp) => {
            store.dispatch(LOADER_FINISHED);
            return resp;
        },
        async (err) => {
            const logAndExit = () => {
                // Better error logging with structured information
                log.error('Request error', {
                    message: err.message,
                    url: err.config?.url,
                    method: err.config?.method,
                    status: err.response?.status,
                    statusText: err.response?.statusText,
                    data: err.response?.data
                });
                store.dispatch(LOADER_FINISHED);
                return Promise.reject(err);
            };

            // Check if err.response exists before accessing status
            if (!err.response || err.response.status !== 401) {
                return logAndExit();
            }

            const refreshToken = store.state.auth.refreshToken;
            if (!refreshToken) {
                return logAndExit();
            }

            try {
                const response = await axios.post('/api/token/refresh', { refreshToken });
                const tokens = response.data.data;
                store.dispatch(AUTH_SET_JWT, tokens);
                err.config.headers.authorization = `Bearer ${tokens.accessToken}`;
                const retryResp = await axios.request(err.config);
                store.dispatch(LOADER_FINISHED);
                return retryResp;
            } catch (retryError) {
                log.warn('Error retrying after refresh token update', { error: retryError });
                getToast().info(getTranslation('auth.sessionExpired'));
                router.push({ name: 'HomePage' });
                return await logAndExit();
            }
        }
    );

    return client;
};

export default {
    createClient,
    get: createClient // Adjusted to return the client directly
};
