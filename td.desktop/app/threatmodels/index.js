'use strict';

var app = require('angular').module('app');
app.controller('desktopreport', ['$q', '$routeParams', '$location', 'common', 'datacontext', 'threatmodellocator', 'electron', require('./desktopreport')]);
