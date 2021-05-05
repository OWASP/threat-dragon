import express from 'express';
import favicon from 'serve-favicon';

/**
 * Gets an instance of an express server
 * @returns {express}
 */
const getInstance = () => express();

/**
 * Gets the favicon middleware for the given path
 * @param {string} path
 * @returns  {favicon}
 */
const getFaviconMiddleware = (path) => favicon(path);

export default {
    getFaviconMiddleware,
    getInstance
};
