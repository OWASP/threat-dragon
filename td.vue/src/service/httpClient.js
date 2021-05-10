import axios from 'axios';

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
        if (store.state.auth.jwt) {
            config.headers.authorization = `Bearer ${store.state.auth.jwt}`;
        }
    
        return config;
    }, (err) => console.error(err));

    // TODO: Add interceptor for response
    return client;
};

export default {
    createClient, // exposed for testing only
    get
};
