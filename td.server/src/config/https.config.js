import env from '../env/Env.js';

const getAppConfig = () => {
    const config = env.get().config;
    const appUsesTls =
        config.APP_USE_TLS &&
        config.APP_TLS_CERT_PATH &&
        config.APP_TLS_KEY_PATH &&
        config.APP_HOSTNAME;
    const healthCheckProtocol = config.SERVER_API_PROTOCOL || (appUsesTls ? 'https' : 'http');
    const isDevelopment = config.NODE_ENV === 'development';

    return { appUsesTls, healthCheckProtocol, isDevelopment };
};

const middleware = (req, res, next) => {
    const { isDevelopment, healthCheckProtocol } = getAppConfig();

    // Always skip HTTPS redirect in development mode
    if (isDevelopment) {
        return next();
    }

    // The 'x-forwarded-proto' check is for Heroku
    if (
        !req.secure &&
        req.get('x-forwarded-proto') !== 'https' &&
        healthCheckProtocol === 'https'
    ) {
        return res.redirect('https://' + req.get('host') + req.url);
    }

    return next();
};

export default {
    middleware
};
