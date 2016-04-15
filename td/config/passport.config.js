'use strict';

var passport = require('passport');
var Strategy = require('passport-github').Strategy;
var cryptoHelper = require('../helpers/encryption.helper');

function passportConfig(app) {
    
    app.use(passport.initialize());
    app.use(passport.session());
    
    //github sigin
    passport.use(new Strategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: '/oauth/github',
        failureRedirect: 'login/github',
        scope: [ 'user:email','repo' ]
    },
    function(accessToken, refreshToken, profile, done) {
        return done(null, {profile: profile, accessToken: accessToken});
    }));

    //serialisation/deserialisation of users
    //session contains sensitive info like access tokens so encrypt it before storage
    
    //encrypt is async to avoid blocking when generating random iv
    passport.serializeUser(function(user, done) {
        require('../config/loggers.config').logger.info('serialising user');
        try {
        cryptoHelper.encrypt(JSON.stringify(user), function(cipherText) {
            done(null, cipherText);
        });
        }
        catch(err) {
            require('../config/loggers.config').logger.info('got an error serialising user: ' + err.message);
        }
    });
    
    //decrypt is syncronous because there is no blocking code  
    passport.deserializeUser(function(obj, done) {
        require('../config/loggers.config').logger.info('deserialising user');
        try {
        var user = JSON.parse(cryptoHelper.decrypt(obj));
        done(null, user);
        }
        catch(err) {
            require('../config/loggers.config').logger.info('got and error deserialising user: ' + err.message);
        }
    });
}

module.exports = passportConfig;
