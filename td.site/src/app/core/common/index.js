'use strict';

var commonModule = require('angular').module('common', []);

commonModule.provider('commonConfig', [require('./common').commonConfig]);
commonModule.factory('common', ['$q', '$rootScope', 'commonConfig', 'logger', require('./common').commonModule]);
commonModule.factory('logger', ['$log', require('./logger')]);