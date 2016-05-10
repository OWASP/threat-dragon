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
        failureRedirect: 'login/github',
        scope: [ 'repo' ]
    },
    function(accessToken, refreshToken, profile, done) {
        return done(null, {profile: profile, accessToken: accessToken});
    }));

    //serialisation/deserialisation of users
    //session contains sensitive info like access tokens so encrypt it before storage
    
    //encrypt is async to avoid blocking when generating random iv
    passport.serializeUser(function(user, done) {
        var userToStore = {accessToken: user.accessToken, profile: {username: user.profile.username, provider: user.profile.provider, repos_url: user.profile._json.repos_url}};
        cryptoHelper.encrypt(JSON.stringify(userToStore), function(cipherText) {
            done(null, cipherText);
        });
    });
    
    //decrypt is syncronous because there is no blocking code  
    passport.deserializeUser(function(obj, done) {
        var user = JSON.parse(cryptoHelper.decrypt(obj));
        done(null, user);
    });
}

module.exports = passportConfig;
