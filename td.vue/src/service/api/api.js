import clientFactory from '../httpClient.js';

/**
 * Does a GET request to the given resource
 * Will apply bearer token authorization if a token is provided
 * @param {String} url
 * @returns Promise
 */
const getAsync = async (url, query) => {
    const res = await clientFactory.get().get(url, query);
    return res.data;
};

/**
 * Does a POST request to the given resource
 * Will add the optional body if provided
 * Will apply bearer token authorization if a token is provided
 * @param {String} url
 * @param {Object?} body
 */
const postAsync = async (url, body) => {
    const res = await clientFactory.get().post(url, body);
    return res.data;
};

/**
 * Does a PUT request to the given resource
 * Will add the body provided
 * Will apply the current bearer token as an auth header
 * @param {String} url
 * @param {Object} body
 */
const putAsync = async (url, body) => {
    const res = await clientFactory.get().put(url, body);
    return res.data;
};

export default {
    getAsync,
    postAsync,
    putAsync
};
