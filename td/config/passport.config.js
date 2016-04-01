'use strict';

var passport = require('passport');
var Strategy = require('passport-github').Strategy;

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
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    }); 
}

module.exports = passportConfig;
