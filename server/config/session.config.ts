'use strict';

var session = require('express-session');
var AzureTablesStoreFactory = require('connect-azuretables')(session);

function configSessions(app) {

    var cookieOptions : any = { maxAge: 3600000 };
    var logger = require('./loggers.config').logger;

    if (process.env.NODE_ENV && process.env.NODE_ENV != 'development') {
        cookieOptions.secure = true;
    } else {
        logger.error({ security: true }, 'secure session cookie flag was false - should only happen in dev environments');
    }

    var sessionOptions : any = {
        secret: process.env.SESSION_SIGNING_KEY,
        resave: false,
        saveUninitialized: false,
        rolling: true,
        cookie: cookieOptions
    };

    if (process.env.SESSION_STORE != 'local') {
        sessionOptions.store = AzureTablesStoreFactory.create({ errorLogger: logger.error.bind(logger) });
    } else {
        //use in-memory session store
        logger.error({ security: true }, 'local session store used - should only happen in dev environments');
    }

    app.use(session(sessionOptions));
}

module.exports = configSessions;
