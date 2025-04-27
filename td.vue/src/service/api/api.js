import clientFactory from '../httpClient.js';
import logger from '@/utils/logger.js';

// Create a context-specific logger
const log = logger.getLogger('api');

/**
 * Does a GET request to the given resource
 * Will apply bearer token authorization if a token is provided
 * @param {String} url
 * @returns Promise
 */
const getAsync = async (url, query) => {
    log.debug('GET request initiated', {
        url,
        params: query
    });
    
    try {
        const client = clientFactory.get();
        log.debug('HTTP client created for GET request');
        
        const res = await client.get(url, { params: query });
        log.debug('GET request succeeded', {
            url,
            status: res.status,
            dataSize: JSON.stringify(res.data).length
        });
        
        return res.data;
    } catch (error) {
        log.error('GET request failed', {
            url,
            error: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            responseData: error.response?.data
        });
        
        if (error.response) {
            log.error('Error response details', {
                status: error.response.status,
                statusText: error.response.statusText,
                headers: error.response.headers,
                data: error.response.data
            });
        }
        
        throw error;
    }
};

/**
 * Does a POST request to the given resource
 * Will add the optional body if provided
 * Will apply bearer token authorization if a token is provided
 * @param {String} url
 * @param {Object?} body
 */
const postAsync = async (url, body) => {
    // Debug logging for POST requests
    log.debug('Making POST request', { url });

    try {
        const client = clientFactory.get();
        log.debug('HTTP client created');

        const res = await client.post(url, body);
        log.debug('POST request succeeded', { url, status: res.status });

        return res.data;
    } catch (error) {
        log.error('POST request failed', { url, error: error.message });
        throw error;
    }
};

/**
 * Does a PUT request to the given resource
 * Will add the body provided
 * Will apply the current bearer token as an auth header
 * @param {String} url
 * @param {Object} body
 */
const putAsync = async (url, body) => {
    try {
        const client = clientFactory.get();
        const res = await client.put(url, body);
        return res.data;
    } catch (error) {
        log.error('PUT request failed', { url, error: error.message });
        throw error;
    }
};

export default {
    getAsync,
    postAsync,
    putAsync
};
