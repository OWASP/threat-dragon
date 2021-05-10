import axios from 'axios';

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
        // TODO: We can handle expired tokens here
        const store = storeFactory.get();
        store.dispatch(LOADER_STARTED);

        if (store.state.auth.jwt) {
            config.headers.authorization = `Bearer ${store.state.auth.jwt}`;
        }
    
        return config;
    }, (err) => {
        console.error(err);
        return Promise.reject(err);
    });

    client.interceptors.response.use((resp) => {
        // Any status within 2xx lies here
        const store = storeFactory.get();
        store.dispatch(LOADER_FINISHED);
        return resp;
    }, (err) => {
        // TODO: Notify the user that there was an error
        // TODO: Handle JWT errors, redirect to login, something else?
        console.error(err);
        return Promise.reject(err);
    });

    // TODO: Add interceptor for response
    return client;
};

export default {
    createClient, // exposed for testing only
    get
};
