import env from '../env/Env.js';

const middleware = (req, res, next) => {
    // The 'x-forwarded-proto' check is for Heroku
    if (!req.secure && req.get('x-forwarded-proto') !== 'https' && env.get().config.SERVER_API_PROTOCOL === 'https') {
        return res.redirect('https://' + req.get('host') + req.url);
    }

    return next();
};

export default {
    middleware
};
