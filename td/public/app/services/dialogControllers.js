'use strict';
var angular = require('angular');

var controllers = {
    confirmController: confirmController,
    structuredExitController: structuredExitController
};

function structuredExitController($scope, $uibModalInstance, $location, destination, cancel, ok) {
    $scope.onCancel = onCancel;
    $scope.onOK = onOK;

    function onCancel() {
        cancel(destination);
    }

    function onOK() {
        ok(destination);
        $location.path(destination);
    }
}

function confirmController($scope, $uibModalInstance, ok, cancel, parameter) {

    $scope.applyToAll = false;
    $scope.onCancel = onCancel;
    $scope.onOK = onOK;

    if (parameter) {
        $scope.parameter = parameter();
    }

    function onCancel(param) {
        if (angular.isDefined(cancel)) { cancel(param); }
        $uibModalInstance.dismiss();
    }

    function onOK(param) {
        if (angular.isDefined(ok)) { ok(param); }
        $uibModalInstance.close();
    }
}

module.exports = controllers;
