'use strict';

var app = require('angular').module('app');
app.controller('shell', ['$rootScope', '$scope', 'common', 'config', require('./shell')]);