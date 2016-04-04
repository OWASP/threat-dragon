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

module.exports = homeController;
