var app = require('angular').module('app');
require('angular-ui-bootstrap');

app.factory('routemediator', ['$rootScope', '$location', 'config', 'logger', require('./routemediator')]);
app.factory('threatengine', [require('./threatengine')]);
app.factory('diagramming', ['common', require('./diagramming')]);
app.controller('structuredExitController', ['$scope', '$uibModalInstance', '$location', 'destination', 'cancel', 'ok', require('./dialogControllers').structuredExitController]);
app.controller('confirmController', ['$scope', '$uibModalInstance', 'ok', 'cancel', 'parameter', require('./dialogControllers').confirmController]);
app.factory('dialogs', ['$location', '$uibModal', require('./dialogs')]);