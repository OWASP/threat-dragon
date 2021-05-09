import bunyan from 'bunyan';
import express from 'express';
import path from 'path';

import env from './env/Env.js';
import envConfig from './config/env.config';
import expressHelper from './helpers/express.helper.js';
import loggers from './config/loggers.config.js';
import parsers from './config/parsers.config.js';
import routes from './config/routes.config.js';
import securityHeaders from './config/securityheaders.config.js';
import { upDir } from './helpers/path.helper.js';

const siteDir = path.join(__dirname, upDir, upDir, 'dist');

const create = () => {
    try {
        const app = expressHelper.getInstance();
        app.set('trust proxy', true);
        app.set('views', path.join(siteDir, 'views'));
        app.set('view engine', 'pug');

        // environment configuration
        envConfig.tryLoadDotEnv();

        //logging
        loggers.configLoggers(app);

        //static content
        app.use('/public', express.static(siteDir));

        //security headers
        securityHeaders.config(app);

        //favicon
        app.use(expressHelper.getFaviconMiddleware(path.join(siteDir, 'favicon.ico')));

        //parsers
        parsers.config(app);

        //routes
        routes.config(app);

        bunyan.createLogger({ name: 'threatdragon', level: 'info' }).info('owasp threat dragon application started up');

        app.set('port', env.get().config.PORT || 3000);

        return app;
    }
    catch (e) {
        const errorLogger = bunyan.createLogger({ name: 'threatdragon' });
        errorLogger.error('owasp threat dragon failed to start up');
        errorLogger.error(e.message);
        throw e;
    }
};

export default {
    create
};
