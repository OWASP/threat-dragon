'use strict';

var session = require('express-session');
var AzureTablesStoreFactory = require('connect-azuretables')(session);

function configSessions(app) {
    
    var cookieOptions = { maxAge: 3600000 };
    
    if(process.env.NODE_ENV != 'development' && process.env.NODE_ENV) {
        cookieOptions.secure = true;
    } else {
        require('../config/loggers.config').logger.error({security: true}, 'secure session cookie flag was false - should only happen in dev environments');
    }

    app.use(session({
        store: AzureTablesStoreFactory.create(),
        secret: process.env.SESSION_SIGNING_KEY,
        resave: false,
        saveUninitialized: false,
        rolling: true,
        cookie: cookieOptions
    }));
}

module.exports = configSessions;
