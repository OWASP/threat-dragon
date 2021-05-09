const addToken = (config, token) => {
    if (token) {
        config.headers.authorization = `Bearer ${token}`;
    }
    return config;
};

const getDefaultGetConfig = (token) => {
    const config = {
        method: 'GET',
        headers: {
            Accept: 'application/json'
        }
    };
    return addToken(config, token);
};

const getDefaultPostConfig = (body, token) => {
    const config = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    };
    if (body) {
        config.body = JSON.stringify(body);
    }
    return addToken(config, token);
};

const handleResponse = (res) => {
    if (res.status === 401) {
        // TODO: handle errors (400, 401, 403, 500 at a minimum)
    }
    return res.json();
};

/**
 * Does a GET request to the given resource
 * Will apply bearer token authorization if a token is provided
 * @param {String} url
 * @param {String?} token
 * @returns Promise
 */
const getAsync = async (url, token) => {
    const res = await window.fetch(url, getDefaultGetConfig(token));
    return handleResponse(res);
};

/**
 * Does a POST request to the given resource
 * Will add the optional body if provided
 * Will apply bearer token authorization if a token is provided
 * @param {String} url
 * @param {Object?} body
 * @param {String?} token
 */
const postAsync = async (url, body, token) => {
    const res = await window.fetch(url, getDefaultPostConfig(body, token));
    return handleResponse(res);
};

export default {
    getAsync,
    postAsync
};
