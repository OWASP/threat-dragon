'use  strict';

var path = require('path');
var homeController = {};

homeController.index = function (req, res) {
    res.cookie('XSRF-TOKEN', req.csrfToken(), { httpOnly: false });
    res.sendFile(path.join(__dirname, '../', 'index.html'));
};

module.exports = homeController;
