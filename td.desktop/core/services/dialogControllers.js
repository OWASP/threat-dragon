'use strict';

var _ = require('lodash');

var controllers = {
    confirmController: confirmController,
    structuredExitController: structuredExitController
};

function structuredExitController($scope, $uibModalInstance, $location, destination, cancel, ok) {
    $scope.onCancel = onCancel;
    $scope.onOK = onOK;

    function onCancel() {
        cancel(destination);
        $uibModalInstance.dismiss();
    }

    function onOK() {
        ok(destination);
        $uibModalInstance.close();
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
        if (_.isFunction(cancel)) { cancel(param); }
        $uibModalInstance.dismiss();
    }

    function onOK(param) {
        if (_.isFunction(ok)) { ok(param); }
        $uibModalInstance.close();
    }
}

module.exports = controllers;