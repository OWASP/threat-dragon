(function () {
    'use strict';

    // Factory name is handy for logging
    var serviceId = 'dialogs';

    // Define the factory on the module.
    // Inject the dependencies. 
    // Point to the factory definition function.
    angular.module('app').factory(serviceId, ['$rootScope', '$location', '$modal', dialogs]);

    function dialogs($rootScope, $location, $modal) {

        // Define the functions and properties to reveal.
        var service = {
            confirm: confirm,
            structuredExit: structuredExit
        };

        return service;

        function structuredExit(event, cancelNavigation, continueNavigation) {

            var modal = $modal.open({
                templateUrl: './app/layout/structuredExit.html',
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

        function structuredExitModal($scope, $modalInstance, $location, destination, cancel, ok) {
            $scope.onCancel = onCancel;
            $scope.onOK = onOK;

            function onCancel() {
                cancel(destination);
                $modalInstance.dismiss();
            }

            function onOK() {
                ok(destination);
                $modalInstance.close();
                $location.path(destination);
            }
        }

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

        function confirmModal($scope, $modalInstance, ok, cancel, parameter) {
            
            $scope.applyToAll = false;
            $scope.onCancel = onCancel;
            $scope.onOK = onOK;

            if (parameter)
            {
                $scope.parameter = parameter();
            }

            function onCancel(param) {
                if (angular.isDefined(cancel)) { cancel(param); }
                $modalInstance.dismiss();
            }

            function onOK(param) {
                if (angular.isDefined(ok)) { ok(param); }
                $modalInstance.close();
            }
        }
    }
})();