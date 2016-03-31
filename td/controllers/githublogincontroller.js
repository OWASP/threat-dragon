'use  strict';
var passport = require('passport');

var githubLoginController = {};

//store original query location and redirect to login
githubLoginController.startLogin = function(req, res, next) {
    req.session.returnTo = req.query.loc ?  '/#' + req.query.loc : '/#/';
    next();
};

//redirect to github
githubLoginController.doLogin = passport.authenticate('github');

//set cookie to determine IDP on the client
//security exception note - needs to be accessible to script
githubLoginController.setIDP = function(req, res) {
    req.log.info(req.user.profile.username + ' logged in via ' + req.user.profile.provider);
    var returnTo = req.session.returnTo;
    delete req.session.returnTo;
    res.cookie('idp', 'github', { httpOnly: false });
    res.redirect(returnTo || '/' );
};

//ensure current user is signed in
githubLoginController.ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn('/login/github');

//return github profile - just to allow simple testing - remove later
githubLoginController.profile = function(req, res) {
    res.json(req.user.profile);
};

//logout
githubLoginController.logout = function(req, res) {
    var username = req.user.profile.username;
    res.clearCookie('idp');
    req.logOut();
    //logout does not seem to do much/anything so do it by hand
    res.clearCookie('connect.sid');
    req.session.destroy(function() {
        req.log.info(username + ' logged out');
        res.redirect('/'); 
    });
}; 

module.exports = githubLoginController;







