import api from './api.js';

const loginAsync = (provider) => api.getAsync(`/api/login/${provider}`);

const completeLoginAsync = async (provider, code) => {
    const response = await api.postAsync(`/api/oauth/${provider}/completeLogin`, { code });
    return response.data; // Ensure this returns { accessToken, refreshToken }
};

const logoutAsync = (refreshToken) => api.postAsync('/api/logout', { refreshToken });

export default {
    completeLoginAsync,
    loginAsync,
    logoutAsync
};
