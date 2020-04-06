var core = angular.module('owasp-threat-dragon-core');
require('angular-ui-bootstrap');
core.factory('routemediator', ['$rootScope', '$location', 'config', 'logger', require('./routemediator')]);
core.factory('threatengine', [require('./threatengine')]);
core.controller('structuredExitController', ['$scope', '$uibModalInstance', '$location', 'destination', 'cancel', 'ok', require('./dialogControllers').structuredExitController]);
core.controller('confirmController', ['$scope', '$uibModalInstance', 'ok', 'cancel', 'parameter', require('./dialogControllers').confirmController]);
core.factory('dialogs', ['$location', '$uibModal', require('./dialogs')]);
core.factory('diagramming', [require('./diagramming')]);
core.value('hotkeys', require('hotkeys-js'));
