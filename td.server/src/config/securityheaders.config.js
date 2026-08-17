import helmet from 'helmet';

import envDefault from '../env/Env.js';

const config = (app, forceSecure, deps) => {
    const resolvedDeps = deps || {};
    const env = resolvedDeps.env || envDefault;

    app.set('x-powered-by', false);
    const ninetyDaysInSeconds = 7776000;
    // Is forceSecure ever used?
    app.use(helmet.hsts({ maxAge: ninetyDaysInSeconds, force: forceSecure, includeSubDomains: false }));
    app.use(helmet.frameguard({ action: 'deny' }));
    app.use(helmet.hidePoweredBy());
    app.use(helmet.noSniff());
    app.use(helmet.xssFilter());
    app.use(helmet.referrerPolicy({ policy: 'strict-origin-when-cross-origin' }));

    const scriptSrc = ["'self'", "'unsafe-eval'"];
    const connectSrc = ["'self'"];

    try {
        const envConfig = env.get().config;
        const plausibleEnabled = envConfig.PLAUSIBLE_ENABLED &&
            String(envConfig.PLAUSIBLE_ENABLED).toLowerCase().trim() !== 'false';

        if (plausibleEnabled && envConfig.PLAUSIBLE_URL) {
            const plausibleUrl = envConfig.PLAUSIBLE_URL.trim();
            scriptSrc.push(plausibleUrl);
            connectSrc.push(plausibleUrl);
        }
    } catch {
        // env may not be hydrated yet during tests; use defaults
    }

    // can't currently use CSP as i would like because various 3rd party libs are using inline style and javascript eval()
    app.use(helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'none'"],
            scriptSrc,
            connectSrc,
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

