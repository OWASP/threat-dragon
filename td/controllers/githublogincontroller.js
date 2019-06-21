'use strict';
var passport = require('passport');

var githubLoginController = {};

//redirect to github with csrf protection
githubLoginController.doLogin = function(req, res, next) {
    if (!req.session.githubOauthState) {
        require('crypto').randomBytes(32, function(err, buffer) {
            var state = buffer.toString('hex');
            req.session.githubOauthState = state;
            passport.authenticate('github', { state: state })(req, res, next);
        });
    } else {
        passport.authenticate('github')(req, res, next);
    }
};

//complete github oauth sign in with csrf protection
githubLoginController.completeLogin = function(req, res) {
    
    var expectedState = req.session.githubOauthState;
    var incomingState = req.query.state;
    delete req.session.githubOauthState;
    
    if(!incomingState || expectedState != incomingState)
    {
        req.log.error({security: true, idp: 'github'}, 'invalid oauth state value');
        res.status(400).send('Threat Dragon received an invalid request from GitHub. Your internet connection may not be secure!');
    } else {
        req.log.info({ security: true, userName: req.user.profile.username, idp: req.user.profile.provider }, 'logged in');
        var returnTo = req.session.returnTo;
        delete req.session.returnTo;
        res.redirect(returnTo || '/');
    }
};

module.exports = githubLoginController;







