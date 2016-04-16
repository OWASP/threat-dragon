'use strict';

var session = require('express-session');
var AzureTablesStoreFactory = require('connect-azuretables')(session);

function configSessions(app) {

    app.use(session({
        store: AzureTablesStoreFactory.create(),
        secret: process.env.SESSION_SIGNING_KEY,
        resave: false,
        saveUninitialized: false,
        rolling: true,
        cookie: { maxAge: 3600000 }
    }));
}

module.exports = configSessions;
