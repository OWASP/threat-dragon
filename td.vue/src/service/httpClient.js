import axios from 'axios';

import { AUTH_SET_JWT } from '../store/actions/auth.js';
import { LOADER_FINISHED, LOADER_STARTED } from '../store/actions/loader.js';
import storeFactory from '../store/index.js';

let cachedClient = null;

const get = () => {
    if (cachedClient === null) {
        cachedClient = createClient();
    }

    return cachedClient;
};

const createClient = () => {
    const client = axios.create();
    client.defaults.headers.common.Accept = 'application/json';
    client.defaults.headers.post['Content-Type'] = 'application/json';
    
    client.interceptors.request.use((config) => {
        const store = storeFactory.get();
        store.dispatch(LOADER_STARTED);

        if (store.state.auth.jwt) {
            config.headers.authorization = `Bearer ${store.state.auth.jwt}`;
        }
    
        return config;
    }, (err) => {
        console.error(err);
        const store = storeFactory.get();
        store.dispatch(LOADER_FINISHED);
        return Promise.reject(err);
    });

    client.interceptors.response.use((resp) => {
        // Any status within 2xx lies here
        const store = storeFactory.get();
        store.dispatch(LOADER_FINISHED);
        return resp;
    }, async (err) => {
        const store = storeFactory.get();

        const logAndExit = () => {
            console.error(err);
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

        // Do not use this axios instance for the refresh token
        // Should this request fail and we use the same instance,
        // we could be stuck in an infinte loop
        try {
            const response = await axios.post('/api/token/refresh', { refreshToken });
            const tokens = response.data.data;
            store.dispatch(AUTH_SET_JWT, tokens);
            err.config.headers.authorization = `Bearer ${tokens.accessToken}`;
            const retryResp = await axios.request(err.config);
            store.dispatch(LOADER_FINISHED);
            return retryResp;
        } catch (retryError) {
            // TODO: Check if retry error is still a 401, maybe we have an outdated refresh token
            // If that's the case, perform a full logout
            // Tell the user that they've been logged out
            // Bring them back to the home page
            console.error('Error retrying after refresh token update');
            console.error(retryError);
            return await logAndExit();
        }
    });

    return client;
};

export default {
    createClient, // exposed for testing only
    get
};
