//set up
var angular = require('angular');
require('owasp-threat-dragon-core');
var app = angular.module('app', ['common', 'owasp-threat-dragon-core']);

//required for demodatacontext tests when simulating failed requests
app.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);

//services
app.factory('threatmodellocator', [require('../../app/services/threatmodellocator')]);
app.factory('datacontextdemo', ['$q', '$http', require('../../app/services/datacontextdemo')]);
app.factory('datacontext', ['$q', 'datacontextdemo', 'electron', require('../../app/services/datacontext')]);
// todo: tests for electron service
// app.factory('electron', ['common', require('../../app/services/electron')]);

// controllers
app.controller('desktopreport', ['$q', '$routeParams', '$location', 'common', 'datacontext', 'threatmodellocator', 'electron', require('../../app/threatmodels/desktopreport')]);
app.controller('welcome', ['$scope', '$location', '$route', 'common', 'electron', 'threatmodellocator', require('../../app/welcome/welcome')]);
app.controller('shell', ['$rootScope', '$scope', '$location', '$route', 'common', 'datacontext', 'electron', 'threatmodellocator', 'VERSION', require('../../app/layout/shell')]);
