var app = require('angular').module('app');
app.factory('routemediator', ['$rootScope', '$location', 'config', 'logger', require('./routemediator')]);
app.factory('threatengine', [require('./threatengine')]);
app.factory('diagramming', ['common', require('./diagramming')]);
app.factory('dialogs', ['$rootScope', '$location', '$uibModal', 'common', 'datacontext', require('./dialogs')]);