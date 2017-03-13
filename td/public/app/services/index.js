var app = require('angular').module('app');
require('angular-ui-bootstrap');
app.factory('routemediator', ['$rootScope', '$location', 'config', 'logger', require('./routemediator')]);
app.factory('datacontext', ['$q', '$http', 'common', require('./datacontext')]);
app.factory('threatengine', [require('./threatengine')]);
app.controller('structuredExitController', ['$scope', '$uibModalInstance', '$location', 'destination', 'cancel', 'ok', require('./dialogControllers').structuredExitController]);
app.controller('confirmController', ['$scope', '$uibModalInstance', 'ok', 'cancel', 'parameter', require('./dialogControllers').confirmController]);
app.factory('dialogs', ['$location', '$uibModal', require('./dialogs')]);
app.factory('diagramming', [require('./diagramming')]);