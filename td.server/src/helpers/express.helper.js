import express from 'express';

/**
 * Gets an instance of an express server
 * @returns {express}
 */
const getInstance = () => express();

export default {
    getInstance
};
