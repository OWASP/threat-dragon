(function () {
    'use strict';

    // Factory name is handy for logging
    var serviceId = 'dialogs';

    // Define the factory on the module.
    // Inject the dependencies. 
    // Point to the factory definition function.
    angular.module('app').factory(serviceId, ['$rootScope', '$location', '$uibModal', 'datacontext', dialogs]);

    function dialogs($rootScope, $location, $modal, datacontext) {

        // Define the functions and properties to reveal.
        var service = {
            confirm: confirm,
            structuredExit: structuredExit,
            githubChooser: githubChooser
        };

        return service;

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

        function structuredExitModal($scope, $uibModalInstance, $location, destination, cancel, ok) {
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

        function confirmModal($scope, $uibModalInstance, ok, cancel, parameter) {
            
            $scope.applyToAll = false;
            $scope.onCancel = onCancel;
            $scope.onOK = onOK;

            if (parameter)
            {
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
        
        function githubChooser(template, onOkPreClose) {
            
            var options = {
                templateUrl: template,
                controller: githubChooserModal,
                keyboard: false,
                backdrop: 'static',
                resolve: {
                    ok: function () { return onOkPreClose; }
                }
            };

            var modal = $modal.open(options);
            
            return modal.result;
        }

        function githubChooserModal($scope, $uibModalInstance, datacontext, ok) {
            
            $scope.onCancel = onCancel;
            $scope.onOK = onOK;
            $scope.getRepos = getRepos;
            $scope.getBranches = getBranches;
            $scope.saveLocation = {};

            getRepos();

            function onCancel() {
                $uibModalInstance.dismiss();
            }

            function onOK() {
                if (angular.isDefined(ok)) { ok($scope.saveLocation); }
                $uibModalInstance.close();
            }
            
            function getRepos() {
                return datacontext.repos().then(
                    function (response) {
                        $scope.repos = response.data;
                    },
                    function (err) {
                        $scope.repos = [];
                        onError(err);
                    }
                );
            }
            
            function getBranches() {
                $scope.branches = null;
                $scope.saveLocation.organisation = $scope.saveLocation.repoFullName.split('/')[0];
                $scope.saveLocation.repo = $scope.saveLocation.repoFullName.split('/')[1];
                
                return datacontext.branches($scope.saveLocation.organisation, $scope.saveLocation.repo).then(
                    function (response) {
                        $scope.branches = response.data;
                    },
                    function (err) {
                        $scope.branches = [];
                        onError(err);
                    }
                );              
            }
            
            function onError(err) {
                vm.error = err;
                logError(err);
            }
        }
    }
})();



        // function getBranches(organisation, repo) {
        //     return datacontext.branches(organisation, repo).then(
        //         function (response) {
        //             vm.branches = response.data;
        //         },
        //         function (err) {
        //             vm.branches = [];
        //             onError(err);
        //         }
        //     );
        // }