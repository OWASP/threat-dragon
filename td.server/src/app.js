import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import rateLimit from 'express-rate-limit';

import env from './env/Env.js';
import envConfig from './config/env.config.js';
import expressHelper from './helpers/express.helper.js';
import https from './config/https.config.js';
import loggerHelper from './helpers/logger.helper.js';
import parsers from './config/parsers.config.js';
import routes from './config/routes.config.js';
import securityHeaders from './config/securityheaders.config.js';
import { upDir } from './helpers/path.helper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Use local dist directory within td.server instead of going up to root project
const siteDir = path.join(__dirname, upDir, 'dist');
// For docs, we'll use a local docs directory or fallback to the root project
const docsDir = path.join(__dirname, upDir, 'docs');

// Note: main rate limiter is configured and applied below
// Helper function to configure rate limiting
const configureRateLimiting = (app, logger) => {
    // rate limiting only for production environments, otherwise automated e2e tests fail
    if (process.env.NODE_ENV === 'production') {
        // Configure rate limiter with trustProxy: false to avoid validation error
        const rateConfig = {
            windowMs: 30 * 60 * 1000, // 30 minutes
            max: 6000,
            standardHeaders: true,
            legacyHeaders: false,
            // Set to false as we've configured trust proxy above
            trustProxy: false
        };
        const configuredLimiter = rateLimit(rateConfig);
        app.use(configuredLimiter);
        logger.info('Apply rate limiting in production environments');
    } else {
        logger.warn('Rate limiting disabled for development environments');
    }
};

// Helper function to configure server settings
const configureServer = (app, logger) => {
    // Configure trust proxy more securely
    app.set('trust proxy', env.get().config.TRUST_PROXY_LIST || '127.0.0.1');

    // Configure security features
    securityHeaders.config(app);
    app.use(https.middleware); // Force HTTPS in production

    // Define MIME type mapping - especially important for CSS files
    const mimeTypes = {
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf',
        '.eot': 'application/vnd.ms-fontobject'
    };

    // Enhanced static file serving with explicit MIME types
    const staticOptions = {
        setHeaders: (res, filePath) => {
            const ext = path.extname(filePath).toLowerCase();
            if (mimeTypes[ext]) {
                res.setHeader('Content-Type', mimeTypes[ext]);
                logger.debug(`Serving ${filePath} with Content-Type: ${mimeTypes[ext]}`);
            }
        }
    };

    // Static content - serve both from /public and direct paths with explicit MIME types
    app.use('/public', express.static(siteDir, staticOptions));
    // Direct access to static asset directories with explicit MIME types
    app.use('/css', express.static(path.join(siteDir, 'css'), staticOptions));
    app.use('/js', express.static(path.join(siteDir, 'js'), staticOptions));
    app.use('/img', express.static(path.join(siteDir, 'img'), staticOptions));
    app.use('/fonts', express.static(path.join(siteDir, 'fonts'), staticOptions));
    app.use('/assets', express.static(path.join(siteDir, 'assets'), staticOptions));
    // Serve favicon explicitly
    app.use('/favicon.ico', (req, res) => {
        res.setHeader('Content-Type', 'image/x-icon');
        res.sendFile(path.join(siteDir, 'favicon.ico'));
    });
    app.use('/docs', express.static(docsDir, staticOptions));

    // parsers and routes
    parsers.config(app);

    // Add debug middleware for static file requests in development mode
    if (process.env.NODE_ENV === 'development') {
        app.use((req, res, next) => {
            // Only log requests for static assets
            if (req.path.match(/\.(css|js|png|jpg|svg|ico)$/i)) {
                logger.debug(
                    `Static asset request: ${req.path} (Content-Type: ${
                        res.get('Content-Type') || 'not set yet'
                    })`
                );
            }
            next();
        });
    }

    routes.config(app);

    // Add 404 handler for static assets
    app.use((req, res, next) => {
        // Only log 404s for potential static assets
        if (
            req.path.match(/\.(css|js|png|jpg|svg|ico|woff|woff2|ttf|eot)$/i) &&
            res.statusCode === 404
        ) {
            logger.warn(`Static asset not found: ${req.path}`);
        }
        next();
    });

    // Set port
    const serverApiPort = env.get().config.SERVER_API_PORT || env.get().config.PORT || 3000;
    app.set('port', serverApiPort);
    logger.info('Express API server listening on ' + app.get('port'));

    // Add CORS headers in development mode
    if (process.env.NODE_ENV === 'development') {
        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept, Authorization'
            );
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

            // Handle preflight requests
            if (req.method === 'OPTIONS') {
                return res.status(200).end();
            }

            return next();
        });
        logger.info('CORS enabled for development mode');
    }
};

const create = () => {
    let logger;

    try {
        // Initialize environment and logging
        envConfig.tryLoadDotEnv();
        loggerHelper.level(env.get().config.LOG_LEVEL);
        logger = loggerHelper.get('app.js');

        // Create and configure Express app
        const app = expressHelper.getInstance();
        configureRateLimiting(app, logger);
        configureServer(app, logger);

        logger.info('OWASP Threat Dragon API server started');
        return app;
    } catch (e) {
        if (!logger) {
            logger = console;
        }
        logger.error('OWASP Threat Dragon API server failed to start');
        logger.error(e.message);
        throw e;
    }
};

export default {
    create
};
