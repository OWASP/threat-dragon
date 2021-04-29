'use strict';

var passport = require('passport');

var GithubStrategy = require('passport-github').Strategy;
var passportHelper = require('../helpers/passport.helper.js');

/**
 * A fake strategy only used for testing, see comments below
 * @param {object} cfg
 */
function TestingStrategy(cfg) {
    this.cfg = cfg;
}

/**
 * Here for testing only.  If someone has a better way, please
 * do so.  I couldn't find a way of mocking a constructor function
 * due to language constraints
 * https://github.com/sinonjs/sinon/issues/1892
 */
function getStrategy() {
    return process.env.IS_TEST === 'true' ? TestingStrategy : GithubStrategy;
}

function passportConfig(app) {
    
    app.use(passport.initialize());
    app.use(passport.session());
    
    var scope = process.env.GITHUB_SCOPE === undefined ? 'public_repo' : process.env.GITHUB_SCOPE;

    var Strategy = getStrategy();
    //github sigin
    passport.use(new Strategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        failureRedirect: 'login/github',
        scope: [ scope ]
    },
    function(accessToken, refreshToken, profile, done) {
        return done(null, {profile: profile, accessToken: accessToken});
    }));

    //serialisation/deserialisation of users
    //session contains sensitive info like access tokens so encrypt it before storage
    
    //encrypt is async to avoid blocking when generating random iv
    passport.serializeUser(passportHelper.default.serializeUser);
    passport.deserializeUser(passportHelper.default.deserializeUser);
}

var exports = {
    config: passportConfig,
    TestingStrategy: TestingStrategy
};

module.exports = exports;
