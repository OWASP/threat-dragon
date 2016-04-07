'use strict';

function configLoggers(app) {

    //app.use(requestLogger('dev'));
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
    
    app.use(require('express-bunyan-logger')({name: 'threatdragon', level: 'info', excludes: excludes}));
}

module.exports = configLoggers;
