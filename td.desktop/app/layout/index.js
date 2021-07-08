'use strict';

var app = require('angular').module('app');
app.controller('shell', ['$rootScope', '$scope', '$location', '$route', 'common', 'datacontext', 'electron', 'threatmodellocator', 'VERSION', require('./shell')]);