import helmet from 'helmet';

const config = (app, forceSecure) => {
    app.set('x-powered-by', false);
    const ninetyDaysInSeconds = 7776000;
    // Is forceSecure ever used?
    app.use(helmet.hsts({ maxAge: ninetyDaysInSeconds, force: forceSecure, includeSubDomains: false }));
    app.use(helmet.frameguard({ action: 'deny' }));
    app.use(helmet.hidePoweredBy());
    app.use(helmet.noSniff());
    app.use(helmet.xssFilter());
    app.use(helmet.referrerPolicy({ policy: 'strict-origin-when-cross-origin' }));
    // can't currently use CSP as i would like because various 3rd party libs are using inline style and javascript eval()
    app.use(helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'none'"],
            scriptSrc: ["'self'", "'unsafe-eval'"],
            connectSrc: ["'self'"],
            styleSrc: ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"], // needed for jquery
            imgSrc: ["'self'", 'data:'],
            fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
            formAction: ["'self'", 'https://github.com'],
            frameAncestors: ["'none'"],
            prefetchSrc: ["'self'"]
        }
    }));
};

export default {
    config
};
