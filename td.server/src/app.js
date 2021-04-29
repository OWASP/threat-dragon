var bunyan = require('bunyan');
var express = require('express');
var path = require('path');

var expressHelper = require('./helpers/express.helper.js');

var upDir = '..' + path.sep;
var siteDir = path.join(__dirname, upDir, upDir, 'dist');

function create() {
    try {
        var app = expressHelper.default.getInstance();
        app.set('trust proxy', true);
        app.set('views', path.join(siteDir, 'views'));
        app.set('view engine', 'pug');

        // environment configuration
        require('./config/env.config').default.tryLoadDotEnv();

        //static content
        app.use('/public', express.static(siteDir));

        //security headers
        require('./config/securityheaders.config').config(app);

        //sessions
        require('./config/session.config').config(app);

        //passport
        require('./config/passport.config').config(app);

        //favicon
        app.use(expressHelper.default.getFaviconMiddleware(path.join(siteDir, 'favicon.ico')));

        //logging
        require('./config/loggers.config').config(app);

        //parsers
        require('./config/parsers.config').config(app);

        //routes
        require('./config/routes.config').config(app);

        bunyan.createLogger({ name: 'threatdragon', level: 'info' }).info('owasp threat dragon application started up');

        return app;
    }
    catch (e) {
        var errorLogger = bunyan.createLogger({ name: 'threatdragon' });
        errorLogger.error('owasp threat dragon failed to start up');
        errorLogger.error(e.message);
    }
}

var appFactory = {
    create: create
};

module.exports = appFactory;
