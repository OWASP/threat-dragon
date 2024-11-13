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

// set up rate limiter: maximum of 6000 requests per 30 minute interval
const limiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 10 minutes
    max: 6000,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

const create = () => {
    let logger;

    try {
        envConfig.tryLoadDotEnv();
        // logging environment, env will always supply a value
        loggerHelper.level(env.get().config.LOG_LEVEL);
        logger = loggerHelper.get('app.js');

        const app = expressHelper.getInstance();
        app.set('trust proxy', true);
        // rate limiting only for production environemnts, otherwise automated e2e tests fail
        if (process.env.NODE_ENV === 'production') {
            app.use(limiter);
            logger.info('Apply rate limiting in production environments');
        } else {
            logger.warn('Rate limiting disabled for development environments');
        }

        // security headers
        securityHeaders.config(app);

        // Force HTTPS in production
        app.use(https.middleware);

        // static content
        app.use('/public', express.static(siteDir));
        app.use('/docs', express.static(docsDir));

        // parsers
        parsers.config(app);

        // routes
        routes.config(app);

        // env will always supply a value for the PORT
        app.set('port', env.get().config.PORT);
        logger.info('Express server listening on ' + app.get('port'));

        logger.info('OWASP Threat Dragon application started');
        return app;
    } catch (e) {
        if (!logger) { logger = console; }
        logger.error('OWASP Threat Dragon failed to start');
        logger.error(e.message);
        throw e;
    }
};

export default {
    create
};
