var express = require('express');
var router = express.Router();
var passport = require('passport');
var Strategy = require('passport-github').Strategy;

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

//store the original location in the session and redirect to the actual authentication route
router.get('/login', function(req, res) {
    req.session.referer = req.query.loc ?  '/#' + req.query.loc : '/#/';
    res.redirect('/login/github');
    });

//redirect to github
router.get('/login/github', passport.authenticate('github'));  

//store the access token and set cookie to tell the client they are logged in
router.get('/oauth/github', 
  passport.authenticate('github'),
  function(req, res) {
    var referer = req.session.referer;
    delete req.session.referer;
    res.cookie('idp', 'github', { httpOnly: false });
    res.redirect(referer || '/' );
  });

//test route to easily check login - todo: delete this 
router.get('/profile',
  require('connect-ensure-login').ensureLoggedIn('/login/github'),
  function(req, res){
    res.json(req.user);
  });

//destroy the session and cookies
router.get('/logout',
function(req, res) {
    res.clearCookie('idp');
    //req.logOut();
    //logout does not seem to do much/anything so do it by hand
    res.clearCookie('connect.sid');
    req.session.destroy(function() { res.redirect('/'); 
        });
    }); 

module.exports = router;
