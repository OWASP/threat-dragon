import api from './api.js';

const resource = '/api/login';

const loginAsync = (provider) => api.getAsync(`${resource}/${provider}`);

export default {
    loginAsync
};
