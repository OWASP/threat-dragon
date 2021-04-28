'use strict';

var app = require('angular').module('app');
app.controller('welcome', ['$location', 'common', 'commonConfig', require('./welcome')]);