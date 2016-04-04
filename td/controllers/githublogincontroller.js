'use  strict';
var passport = require('passport');

var githubLoginController = {};

//store original query location and redirect to login
githubLoginController.startLogin = function(req, res, next) {
    req.session.returnTo = req.body.loc ?  '/#' + req.body.loc : '/#/';
    next();
};

//redirect to github with csrf protection
githubLoginController.doLogin = function(req, res, next) {

    if (!req.session.githubOauthState) {
        require('crypto').randomBytes(24, function(err, buffer) {
            var state = buffer.toString('hex');
            req.session.githubOauthState = state;
            passport.authenticate('github', { state: state })(req, res, next);
        });
    } else {
        passport.authenticate('github')(req, res, next);
    }
}

//complete github oauth sign in with csrf protection
githubLoginController.completeLogin = function(req, res) {
    
    if(!req.query.state || req.session.githubOauthState != req.query.state)
    {
        req.log.error('security exception: invalid oauth state value');
        res.status(400).send('Invalid OAuth state value. Your internet connection may not be secure!');
    }
    
    req.log.info(req.user.profile.username + ' logged in via ' + req.user.profile.provider);
    var returnTo = req.session.returnTo;
    delete req.session.returnTo;
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







