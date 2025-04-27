import api from './api.js';
import logger from '@/utils/logger.js';

// Create a context-specific logger
const log = logger.getLogger('api:login');

const loginAsync = (provider) => api.getAsync(`/api/login/${provider}`);

const completeLoginAsync = async (provider, code) => {
    log.info('Making completeLoginAsync request', {
        endpoint: `/api/oauth/${provider}/completeLogin`,
        provider
    });

    // Ensure code is valid before making the API call
    if (!code) {
        log.error('completeLoginAsync: No authorization code provided');
        throw new Error('No authorization code provided');
    }

    // Don't log the full code for security
    log.info('Authorization code validation', {
        codePresent: Boolean(code),
        codeLength: code.length,
        codePrefix: code.substring(0, 4) + '...'
    });

    try {
        // Log environment information
        log.debug('Environment information', {
            nodeEnv: process.env.NODE_ENV,
            baseUrl: window.location.origin,
            currentUrl: window.location.href.replace(/code=[^&]+/g, 'code=REDACTED')
        });
        
        const url = `/api/oauth/${provider}/completeLogin`;
        log.debug('API request details', {
            fullUrl: `${window.location.origin}${url}`,
            provider,
            method: 'POST'
        });

        // Make the API call with explicit content type headers
        log.debug('Sending request', {
            method: 'POST',
            payload: { code: 'REDACTED' }
        });

        // Add timing information
        const startTime = Date.now();
        const response = await api.postAsync(url, { code });
        const endTime = Date.now();

        // API service already handles status codes and parsing
        log.debug('Response received from API service', {
            responseTime: `${endTime - startTime}ms`
        });

        // Standard response format should include data property
        const data = response.data;

        // Log success but not the actual tokens for security
        log.info('Response data validation', {
            hasData: Boolean(data),
            dataType: typeof data,
            accessTokenPresent: Boolean(data?.accessToken),
            refreshTokenPresent: Boolean(data?.refreshToken),
            responseKeys: data ? Object.keys(data) : []
        });

        // Validate response format
        if (!data || !data.accessToken || !data.refreshToken) {
            log.error('Invalid response format, missing tokens', {
                hasData: Boolean(data),
                hasAccessToken: Boolean(data?.accessToken),
                hasRefreshToken: Boolean(data?.refreshToken),
                responseKeys: data ? Object.keys(data) : [],
                responseData: typeof data === 'object' ? JSON.stringify(data) : String(data)
            });
            throw new Error('Invalid server response format (missing token data)');
        }

        log.info('Login completed successfully for provider', { provider });
        return data; // Expecting { accessToken, refreshToken }
    } catch (error) {
        log.error('Error in completeLoginAsync API call', {
            message: error.message,
            provider,
            stack: error.stack,
            ...(error.response ? {
                status: error.response.status,
                statusText: error.response.statusText,
                headers: JSON.stringify(error.response.headers || {}),
                data: JSON.stringify(error.response.data || {})
            } : {}),
            ...(error.request ? {
                requestSent: true,
                method: 'POST',
                url: `/api/oauth/${provider}/completeLogin`
            } : {})
        });
        throw error;
    }
};

const logoutAsync = (refreshToken) => api.postAsync('/api/logout', { refreshToken });

export default {
    completeLoginAsync,
    loginAsync,
    logoutAsync
};
