var app = require('angular').module('app');
app.controller('shell', ['$rootScope', '$scope', '$location', 'common', 'config', require('./shell')]);
