import express from 'express';

import auth from '../controllers/auth.js';
import bearer from './bearer.config.js';
import healthcheck from '../controllers/healthcheck.js';
import homeController from '../controllers/homecontroller.js';
import threatmodelController from '../controllers/threatmodelcontroller.js';

/**
 * Routes that do **NOT** require authentication
 * Use with caution!!!!
 * @param {express.Router} router
 * @returns {express.Router}
 */
const unauthRoutes = (router) => {
    router.get('/', homeController.index);
    router.get('/healthz', healthcheck.healthz);
    router.get('/logoutform', homeController.logoutform);
    router.post('/logout', homeController.logout);

    router.get('/api/login/:provider', auth.login);
    router.get('/api/oauth/return', auth.oauthReturn);
    router.get('/api/oauth/:provider', auth.completeLogin);
};

/**
 * Routes that require authentication.
 * This should be where you add new routes by default
 * @param {express.Router} router
 * @returns {express.Router}
 */
const routes = (router) => {
    router.get('/api/threatmodel/repos', threatmodelController.repos);
    router.get('/api/threatmodel/:organisation/:repo/branches', threatmodelController.branches);
    router.get('/api/threatmodel/:organisation/:repo/:branch/models', threatmodelController.models);
    router.get('/api/threatmodel/:organisation/:repo/:branch/:model/data', threatmodelController.model);
    
    router.delete('/threatmodel/:organisation/:repo/:branch/:model', threatmodelController.deleteModel);
    router.put('/threatmodel/:organisation/:repo/:branch/:model/create', threatmodelController.create);
    router.put('/threatmodel/:organisation/:repo/:branch/:model/update', threatmodelController.update);
};

const config = (app) => {
    const router = express.Router();
    unauthRoutes(router);

    router.use(bearer.middleware);
    routes(router);

    app.use('/', router);
};

export default {
    config
};
