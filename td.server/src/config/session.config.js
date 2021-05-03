'use strict';

var session = require('express-session');
var AzureTablesStoreFactory = require('connect-azuretables')(session);

var env = require('../env/Env.js');

function configSessions(app) {

    var cookieOptions = { maxAge: 3600000 };
    var logger = require('../config/loggers.config').default.logger;

    if (env.default.get().config.NODE_ENV && env.default.get().config.NODE_ENV != 'development') {
        cookieOptions.secure = true;
    } else {
        logger.error({ security: true }, 'secure session cookie flag was false - should only happen in dev environments');
    }

    var sessionOptions = {
        secret: env.default.get().config.SESSION_SIGNING_KEY,
        resave: false,
        saveUninitialized: false,
        rolling: true,
        cookie: cookieOptions
    };

    if (env.default.get().config.SESSION_STORE != 'local') {
        sessionOptions.store = AzureTablesStoreFactory.create({ errorLogger: logger.error.bind(logger) });
    } else {
        //use in-memory session store
        logger.error({ security: true }, 'local session store used - should only happen in dev environments');
    }

    app.use(session(sessionOptions));
}

var exports = {
    config: configSessions
};

module.exports = exports;
