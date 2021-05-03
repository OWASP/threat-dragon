import csrf from 'csurf';
import express from 'express';

import githubController from '../controllers/githublogincontroller.js';
import homeController from '../controllers/homecontroller.js';
import threatmodelController from '../controllers/threatmodelcontroller.js';

const config = (app) => {
    const router = express.Router();

    const csrfProtection = csrf();

    router.get('/', csrfProtection, homeController.ensureLoggedIn, homeController.index);
    router.get('/healthz', (req, res) => res.send('true'));

    router.get('/login', csrfProtection, homeController.login);
    router.get('/logoutform', csrfProtection, homeController.logoutform);
    router.post('/logout', csrfProtection, homeController.logout);

    router.post('/login', csrfProtection, githubController.doLogin);
    router.get('/login/github', githubController.doLogin);
    router.get('/oauth/github', githubController.doLogin, githubController.completeLogin);

    router.get('/threatmodel/repos', homeController.ensureLoggedIn, threatmodelController.repos);
    router.get('/threatmodel/:organisation/:repo/branches', homeController.ensureLoggedIn, threatmodelController.branches);
    router.get('/threatmodel/:organisation/:repo/:branch/models', homeController.ensureLoggedIn, threatmodelController.models);
    router.get('/threatmodel/:organisation/:repo/:branch/:model/data', homeController.ensureLoggedIn, threatmodelController.model);
    router.delete('/threatmodel/:organisation/:repo/:branch/:model', csrfProtection, homeController.ensureLoggedIn, threatmodelController.deleteModel);
    router.put('/threatmodel/:organisation/:repo/:branch/:model/create', csrfProtection, homeController.ensureLoggedIn, threatmodelController.create);
    router.put('/threatmodel/:organisation/:repo/:branch/:model/update', csrfProtection, homeController.ensureLoggedIn, threatmodelController.update);

    app.use('/', router);
};

export default {
    config
};
