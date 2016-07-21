'use strict';

var angular = require('angular');

function dialogs($rootScope, $location, $modal, common, datacontext) {

    var service = {
        confirm: confirm,
        structuredExit: structuredExit
    };


    function structuredExit(event, cancelNavigation, continueNavigation) {

        var modal = $modal.open({
            templateUrl: './public/app/layout/structuredExit.html',
            controller: structuredExitModal,
            keyboard: false,
            backdrop: 'static',
            resolve: {
                destination: function () { return $location.path(); },
                cancel: function () { return cancelNavigation; },
                ok: function () { return continueNavigation; }
            }
        });

        event.preventDefault();

        return modal.result;
    }

    var structuredExitModal = ['$scope', '$uibModalInstance', '$location', 'destination', 'cancel', 'ok', function($scope, $uibModalInstance, $location, destination, cancel, ok) {
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
    }];

    function confirm(template, onOkPreClose, getParameter, onCancelPreClose, windowClass) {

        var options = {
            templateUrl: template,
            controller: confirmModal,
            keyboard: false,
            backdrop: 'static',
            resolve: {
                ok: function () { return onOkPreClose; },
                cancel: function () { return onCancelPreClose; },
                parameter: function () { return getParameter; }
            }
        };

        if (windowClass) {

            options.windowClass = windowClass;

        }

        var modal = $modal.open(options);

        return modal.result;
    }

    var confirmModal = ['$scope', '$uibModalInstance', 'ok', 'cancel', 'parameter', function($scope, $uibModalInstance, ok, cancel, parameter) {

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
    }];
    
    return service;
}

module.exports = dialogs;