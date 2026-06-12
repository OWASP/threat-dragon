/**
 * Normalises decoded repository paths for reverse proxies that redirect
 * encoded GitLab subgroup separators from "%2F" to "/".
 */
const middleware = (req, res, next) => {
    if (Array.isArray(req.params.repo)) {
        req.params.repo = req.params.repo.join('/');
    }

    return next();
};

export default {
    middleware
};
