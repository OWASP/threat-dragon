import axios from 'axios';
import { useToast } from 'vue-toast-notification';
import { AUTH_SET_JWT } from '@/store/actions/auth.js';
import i18n from '@/i18n/index.js';
import { LOADER_FINISHED, LOADER_STARTED } from '@/store/actions/loader.js';
import router from '@/router/index.js';
import store from '@/store/index.js'; // Direct import

const toast = useToast();

const createClient = () => {
    const client = axios.create();
    client.defaults.headers.common.Accept = 'application/json';
    client.defaults.headers.post['Content-Type'] = 'application/json';
    client.interceptors.request.use((config) => {
        store.dispatch(LOADER_STARTED);

        if (store.state.auth.jwt) {
            config.headers.authorization = `Bearer ${store.state.auth.jwt}`;
        }

        return config;
    }, (err) => {
        console.error("Request error:",err);
        store.dispatch(LOADER_FINISHED);
        return Promise.reject(err);
    });

    client.interceptors.response.use((resp) => {
        store.dispatch(LOADER_FINISHED);
        return resp;
    }, async (err) => {
        const logAndExit = () => {
            console.error("Request error:",err);
            store.dispatch(LOADER_FINISHED);
            return Promise.reject(err);
        };

        if (err.response.status !== 401) {
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
            console.warn('Error retrying after refresh token update');
            console.warn(retryError);
            toast.info(i18n.t('auth.sessionExpired'));
            router.push({ name: 'HomePage' });
            return await logAndExit();
        }
    });

    return client;
};

export default {
    createClient,
    get: createClient // Adjusted to return the client directly
};