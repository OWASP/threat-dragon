'use strict';

var session = require('express-session');
var AzureTablesStoreFactory = require('connect-azuretables')(session);

function configSessions(app) {

    app.use(session({
        store: AzureTablesStoreFactory.create({ logger: console.log, errorLogger: console.log }),
        secret: process.env.SESSION_SIGNING_KEY,
        resave: false,
        saveUninitialized: false
    }));
}

module.exports = configSessions;
