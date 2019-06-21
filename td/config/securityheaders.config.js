'use strict';

var helmet = require('helmet');

var securityHeaders = function (app, forceSecure) {
    
    app.set('x-powered-by', false);
    var ninetyDaysInSeconds = 7776000;
    app.use(helmet.hsts({ maxAge: ninetyDaysInSeconds, force: forceSecure, includeSubdomains: false }));
    app.use(helmet.frameguard({action: 'deny'}));
    app.use(helmet.hidePoweredBy());
    app.use(helmet.noSniff());
    app.use(helmet.xssFilter());
    app.use(helmet.referrerPolicy({ policy: 'strict-origin-when-cross-origin' }));
    // can't currently use CSP as i would like because various 3rd party libs are using inline style and javascript eval()
    app.use(helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'none'"],
            scriptSrc: ["'self'"],
            connectSrc: ["'self'"],
            styleSrc: ["'self'", 'http://fonts.googleapis.com', 'https://fonts.googleapis.com', "'unsafe-inline'"], //needed for jquery
            imgSrc: ["'self'", 'data:'],
            fontSrc: ["'self'", 'http://fonts.gstatic.com', 'https://fonts.gstatic.com', 'data:'],
            formAction: ["'self'", 'https://github.com'],
            reportUri: 'https://owaspthreatdragon.report-uri.com/r/d/csp/enforce'
        }
    }));
};

module.exports = securityHeaders;