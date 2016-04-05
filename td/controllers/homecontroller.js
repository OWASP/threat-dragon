'use  strict';

var path = require('path');
var homeController = {};

homeController.index = function (req, res) {
    //angular ajax request need xsrf token as a script accessible cookie
    res.cookie('XSRF-TOKEN', req.csrfToken(), { httpOnly: false });
    res.sendFile(path.join(__dirname, '../', 'index.html'));
};

homeController.login = function (req, res) {
    res.render('login', { csrfToken: req.csrfToken() })
};

homeController.logoutform = function (req, res) {
    res.render('logoutform', { csrfToken: req.csrfToken() })
};

//logout
homeController.logout = function(req, res) {
    var username = req.user.profile.username;
    req.logOut();
    //logout does not seem to do much/anything so do it by hand
    res.clearCookie('connect.sid');
    res.clearCookie('XSRF-TOKEN');
    req.session.destroy(function() {
        req.log.info({security: true, userName: username}, 'logged out');
        res.redirect('/'); 
    });
}; 

module.exports = homeController;
