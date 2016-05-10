'user strict';

var helmet = require('helmet');

var securityHeaders = function (app, forceSecure) {
    
    app.set('x-powered-by', false);
    var ninetyDaysInMilliseconds = 7776000000;
    app.use(helmet.hsts({ maxAge: ninetyDaysInMilliseconds, force: forceSecure }));
    app.use(helmet.frameguard('deny'));
    app.use(helmet.hidePoweredBy());
    app.use(helmet.noSniff());
    app.use(helmet.xssFilter());
    // can't currently use CSP as i would like because various 3rd party libs are using inline style and javascript eval()
    app.use(helmet.csp({
        directives: {
            defaultSrc: ["'none'"],
            scriptSrc: ["'self'", "'unsafe-eval'"], //needed for lodash and nools
            connectSrc: ["'self'"],
            styleSrc: ["'self'", 'http://fonts.googleapis.com', 'https://fonts.googleapis.com', "'unsafe-inline'"], //needed for jquery
            imgSrc: ["'self'", 'data:'],
            fontSrc: ["'self'", 'http://fonts.gstatic.com', 'https://fonts.gstatic.com'],
            formAction: ["'self'", 'https://github.com'],
            reportUri: 'https://report-uri.io/report/owaspthreatdragon'
        }
    }));
};

module.exports = securityHeaders;