import express from 'express';
import path from 'path';
import rateLimit from 'express-rate-limit';

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

// set up rate limiter: maximum of 100 requests per 15 minutes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const create = () => {
    let logger;

    try {
        const app = expressHelper.getInstance();
        app.set('trust proxy', true);

        // environment configuration
        envConfig.tryLoadDotEnv();
        logger = loggerHelper.get('app.js');

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

        // rate limiting for the routes
        app.use(limiter);

        logger.info('OWASP Threat Dragon application started');

        // if this default is changed then ensure docs are updated and CI pipeline ci.yaml still works
        app.set('port', env.get().config.SERVER_API_PORT || 3000);

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
