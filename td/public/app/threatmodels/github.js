(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'github';

    // Define the controller on the module.
    // Inject the dependencies. 
    // Point to the controller definition function.
    angular.module('app').controller(controllerId,
        ['$q', '$routeParams', 'common', 'datacontext', github]);

    function github($q, $routeParams, common, datacontext) {
        // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
        /*jshint validthis: true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, 'error');

        // Bindable properties and functions are placed on vm.
        vm.title = 'Load From GitHub';

        activate();

        function activate() {
            common.activateController([load()], controllerId)
                .then(function () { log('Activated GitHub Controller'); });
        }

        function load() {
            vm.error = null;
            vm.organisation = $routeParams.organisation;
            vm.repo = $routeParams.repo;
            vm.branch = $routeParams.branch;

            if (!vm.organisation && !vm.repo) {
                getRepos();
            }
            else {
                if (!vm.branch) {
                    getBranches(vm.organisation, vm.repo);
                }
                else {
                    getModels(vm.organisation, vm.repo, vm.branch);
                }
            }
        }

        function getRepos() {
            return datacontext.repos().then(
                function (response) {
                    vm.repos = response.data;
                },
                function (err) {
                    vm.repos = [];
                    onError(err);
                }
            );
        }

        function getBranches(organisation, repo) {
            return datacontext.branches(organisation, repo).then(
                function (response) {
                    vm.branches = response.data;
                },
                function (err) {
                    vm.branches = [];
                    onError(err);
                }
            );
        }

        function getModels(organisation, repo, branch) {
            return datacontext.models(organisation, repo, branch).then(
                function (response) {
                    vm.models = response.data;
                },
                function (err) {
                    vm.models = [];
                    onError(err);
                });
        }
        
        function onError(err) {
            vm.error = err;
            logError(err);
        }
    }
})();