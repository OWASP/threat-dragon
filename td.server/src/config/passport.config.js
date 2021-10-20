import passport from 'passport';

import env from '../env/Env.js';
import { Strategy as GithubStrategy } from 'passport-github';
import passportHelper from '../helpers/passport.helper.js';

/**
 * A fake strategy only used for testing
 */
class TestingStrategy {

    /**
     * @constructor
     * @param {object} cfg
     */
    constructor(cfg) {
        this.cfg = cfg;
    }
}

/**
 * Here for testing only: If there's a better way, please open a PR
 * I couldn't find a reliable way of mocking a constructor function
 * due to language constraints: https://github.com/sinonjs/sinon/issues/1892
 * @returns {Class}
 */
const getStrategy = () => (env.get().config.IS_TEST === 'true' ? TestingStrategy : GithubStrategy);

/**
 * The passport strategy callback
 * @param {string} accessToken
 * @param {string} refreshToken
 * @param {object} profile
 * @param {Function} done
 * @returns {Function}
 */
const strategyCallback = (accessToken, refreshToken, profile, done) => done(null, {profile: profile, accessToken: accessToken});

/**
 * Configures the application to use Passport based on the environment
 * @param {object} app
 */
const config = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());

    const githubScope = env.get().config.GITHUB_SCOPE || 'public_repo';

    const Strategy = getStrategy();
    const githubConfig = {
        clientID: env.get().config.GITHUB_CLIENT_ID,
        clientSecret: env.get().config.GITHUB_CLIENT_SECRET,
        failureRedirect: 'login/github',
        scope: [ githubScope ]
    };

    const enterpriseHostname = env.get().config.GITHUB_ENTERPRISE_HOSTNAME;
    if (enterpriseHostname) {
        const port = env.get().config.GITHUB_ENTERPRISE_PORT || '';
        const protocol = env.get().config.GITHUB_ENTERPRISE_PROTOCOL || 'https';
        const enterpriseUrl = `${protocol}://${enterpriseHostname}${port ? ':' + port : ''}`;

        githubConfig.authorizationURL = `${enterpriseUrl}/login/oauth/authorize`;
        githubConfig.tokenURL = `${enterpriseUrl}/login/oauth/access_token`;
        githubConfig.userProfileURL = `${enterpriseUrl}/api/v3/useer`;
    }

    passport.use(new Strategy(githubConfig, strategyCallback));
    passport.serializeUser(passportHelper.serializeUser);
    passport.deserializeUser(passportHelper.deserializeUser);
};

export default {
    config,
    TestingStrategy
};
