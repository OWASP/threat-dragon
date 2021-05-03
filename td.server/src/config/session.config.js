import session from 'express-session';

import azureTableSession from './azuretablesession.config.js';
import env from '../env/Env.js';
import { logger } from './loggers.config.js';

const config = (app) => {
    const cookieOptions = {
        maxAge: 3600000,
        secure: env.get().config.NODE_ENV !== 'development'
    };

    const sessionOptions = {
        secret: env.get().config.SESSION_SIGNING_KEY,
        resave: false,
        saveUninitialized: false,
        rolling: true,
        cookie: cookieOptions
    };

    if (!cookieOptions.secure) {
        logger.error({ security: true }, 'secure session cookie flag was false - should only happen in dev environments');
    }

    if (env.get().config.SESSION_STORE !== 'local') {
        sessionOptions.store = azureTableSession.config(session, logger);
    } else {
        //use in-memory session store
        logger.error({ security: true }, 'local session store used - should only happen in dev environments');
    }

    app.use(session(sessionOptions));
};

export default {
    config
};
