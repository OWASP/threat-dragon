import api from './api.js';

const loginAsync = (provider) => api.getAsync(`/api/login/${provider}`);

const completeLoginAsync = (provider, code) => api.getAsync(`/api/oauth/${provider}?code=${code}`);

const logoutAsync = (refreshToken) => api.postAsync('/api/logout', { refreshToken });

export default {
    completeLoginAsync,
    loginAsync,
    logoutAsync
};
