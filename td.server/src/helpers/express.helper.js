import express from 'express';
import favicon from 'serve-favicon';

/**
 * Gets an instance of an express server
 * @returns {express}
 */
const getInstance = () => {
    return express();
};

/**
 * Gets the favicon middleware for the given path
 * @param {string} path
 * @returns  {favicon}
 */
const getFaviconMiddleware = (path) => {
    return favicon(path);
};

export default {
    getFaviconMiddleware,
    getInstance
};
