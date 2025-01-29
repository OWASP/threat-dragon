import express from 'express';

import auth from '../controllers/auth.js';
import bearer from './bearer.config.js';
import configController from "../controllers/configcontroller";
import googleProviderThreatmodelController from '../controllers/googleProviderThreatmodelController.js';
import healthcheck from '../controllers/healthz.js';
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
    router.get('/api/config', configController.config);
    router.get('/api/threatmodel/organisation', threatmodelController.organisation);

    router.get('/api/login/:provider', auth.login);
    router.get('/api/logout', auth.logout);
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
    router.post('/api/logout', auth.logout);
    router.post('/api/token/refresh', auth.refresh);

    router.get('/api/threatmodel/repos', threatmodelController.repos);
    router.get('/api/threatmodel/:organisation/:repo/branches', threatmodelController.branches);
    router.get('/api/threatmodel/:organisation/:repo/:branch/models', threatmodelController.models);
    router.get('/api/threatmodel/:organisation/:repo/:branch/:model/data', threatmodelController.model);

    router.post('/api/threatmodel/:organisation/:repo/:branch/createBranch', threatmodelController.createBranch);

    // removed because of security denial of service concerns (denial of models)
    //router.delete('/api/threatmodel/:organisation/:repo/:branch/:model', threatmodelController.deleteModel);

    router.post('/api/threatmodel/:organisation/:repo/:branch/:model/create', threatmodelController.create);
    router.put('/api/threatmodel/:organisation/:repo/:branch/:model/update', threatmodelController.update);

    // Google Drive routes
    router.get('/api/googleproviderthreatmodel/folders', googleProviderThreatmodelController.folders);
    router.post('/api/googleproviderthreatmodel/:folder/create', googleProviderThreatmodelController.create);
    router.put('/api/googleproviderthreatmodel/:file/update', googleProviderThreatmodelController.update);
    router.get('/api/googleproviderthreatmodel/:file/data', googleProviderThreatmodelController.model);
};

const config = (app) => {
    const router = express.Router();
    unauthRoutes(router);

    // routes protected by authorization
    router.use(bearer.middleware);
    routes(router);

    app.use('/', router);
};

export default {
    config
};
