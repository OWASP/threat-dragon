import csrf from 'csurf';
import express from 'express';

import bearer from './bearer.config.js';
import githubController from '../controllers/githublogincontroller.js';
import homeController from '../controllers/homecontroller.js';
import threatmodelController from '../controllers/threatmodelcontroller.js';

/**
 * Routes that do **NOT** require authentication
 * Use with caution!!!!
 * @param {express.Router} router
 * @param {*} csrfProtection
 * @returns {express.Router}
 */
const unauthRoutes = (router, csrfProtection) => {
    router.get('/', csrfProtection, homeController.ensureLoggedIn, homeController.index);
    router.get('/healthz', (req, res) => res.send('true'));
    router.get('/logoutform', csrfProtection, homeController.logoutform);
    router.post('/logout', csrfProtection, homeController.logout);

    router.get('/api/login/github', githubController.login);
    router.get('/api/oauth/return', githubController.oauthReturn);
    router.get('/api/oauth/github', githubController.completeLogin);
};

/**
 * Routes that require authentication.
 * This should be where you add new routes by default
 * @param {express.Router} router
 * @param {*} csrfProtection
 * @returns {express.Router}
 */
const routes = (router, csrfProtection) => {
    router.get('/api/threatmodel/repos', threatmodelController.repos);
    router.get('/api/threatmodel/:organisation/:repo/branches', threatmodelController.branches);
    router.get('/api/threatmodel/:organisation/:repo/:branch/models', threatmodelController.models);
    router.get('/api/threatmodel/:organisation/:repo/:branch/:model/data', threatmodelController.model);
    
    router.delete('/threatmodel/:organisation/:repo/:branch/:model', csrfProtection, homeController.ensureLoggedIn, threatmodelController.deleteModel);
    router.put('/threatmodel/:organisation/:repo/:branch/:model/create', csrfProtection, homeController.ensureLoggedIn, threatmodelController.create);
    router.put('/threatmodel/:organisation/:repo/:branch/:model/update', csrfProtection, homeController.ensureLoggedIn, threatmodelController.update);
};

const config = (app) => {
    const router = express.Router();
    const csrfProtection = csrf();
    unauthRoutes(router, csrfProtection);

    router.use(bearer.middleware);
    routes(router, csrfProtection);

    app.use('/', router);
};

export default {
    config
};
