var bunyan = require('bunyan');
var express = require('express');
var path = require('path');

var env = require('./env/Env.js');
var expressHelper = require('./helpers/express.helper.js');
var loggers = require('./config/loggers.config.js');
var parsers = require('./config/parsers.config.js');
var passport = require('./config/passport.config.js');
var routes = require('./config/routes.config.js');
var securityHeaders = require('./config/securityheaders.config.js');
var session = require('./config/session.config.js');

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
        securityHeaders.default.config(app);

        //sessions
        session.default.config(app);

        //passport
        passport.default.config(app);

        //favicon
        app.use(expressHelper.default.getFaviconMiddleware(path.join(siteDir, 'favicon.ico')));

        //logging
        loggers.default.configLoggers(app);

        //parsers
        parsers.default.config(app);

        //routes
        routes.default.config(app);

        bunyan.createLogger({ name: 'threatdragon', level: 'info' }).info('owasp threat dragon application started up');

        app.set('port', env.default.get().config.PORT || 3000);

        return app;
    }
    catch (e) {
        var errorLogger = bunyan.createLogger({ name: 'threatdragon' });
        errorLogger.error('owasp threat dragon failed to start up');
        errorLogger.error(e.message);
        throw e;
    }
}

var appFactory = {
    create: create
};

module.exports = appFactory;
