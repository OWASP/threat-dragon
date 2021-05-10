import clientFactory from './httpClient.js';

/**
 * Does a GET request to the given resource
 * Will apply bearer token authorization if a token is provided
 * @param {String} url
 * @returns Promise
 */
const getAsync = async (url) => {
    const res = await clientFactory.get().get(url);
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

export default {
    getAsync,
    postAsync
};
