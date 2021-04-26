'use strict';

var excludes = [
    "req-headers",
    "res-headers",
    "res",
    "req",
    "short-body",
    "body",
    "response-hrtime",
    "incoming",
    "user-agent",
    "response-time",
    "http-version"
];

var bunyanOptions = {name: 'threatdragon', level: 'info', excludes: excludes};

function configLoggers(app) {   
    app.use(require('express-bunyan-logger')(bunyanOptions));
}

var logger = require('bunyan').createLogger(bunyanOptions);

var loggers = {
    config: configLoggers,
    logger: logger   
};

module.exports = loggers;
