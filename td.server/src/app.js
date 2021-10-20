import express from 'express';
import path from 'path';

import env from './env/Env.js';
import envConfig from './config/env.config';
import expressHelper from './helpers/express.helper.js';
import https from './config/https.config.js';
import loggerHelper from './helpers/logger.helper.js';
import parsers from './config/parsers.config.js';
import routes from './config/routes.config.js';
import securityHeaders from './config/securityheaders.config.js';
import { upDir } from './helpers/path.helper.js';

const siteDir = path.join(__dirname, upDir, upDir, 'dist');
const docsDir = path.join(__dirname, upDir, upDir, 'docs');

const create = () => {
    let logger;

    try {
        const app = expressHelper.getInstance();
        app.set('trust proxy', true);
        app.set('views', path.join(siteDir, 'views'));
        app.set('view engine', 'pug');

        // environment configuration
        envConfig.tryLoadDotEnv();
        logger = loggerHelper.get('app.js')

        //security headers
        securityHeaders.config(app);

        // Force HTTPS in production
        app.use(https.middleware);

        //static content
        app.use('/public', express.static(siteDir));
        app.use('/docs', express.static(docsDir));

        //parsers
        parsers.config(app);

        //routes
        routes.config(app);

        logger.info('OWASP Threat Dragon application started');

        app.set('port', env.get().config.PORT || 3000);

        return app;
    }
    catch (e) {
        if (!logger) { logger = console; }
        logger.error('OWASP Threat Dragon failed to start');
        logger.error(e.message);
        throw e;
    }
};

export default {
    create
};
