(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'github';

    // Define the controller on the module.
    // Inject the dependencies. 
    // Point to the controller definition function.
    angular.module('app').controller(controllerId,
        ['common', 'datacontext', github]);

    function github(common, datacontext) {
        // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
        /*jshint validthis: true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, 'error');

        // Bindable properties and functions are placed on vm.
        vm.title = 'Load From GitHub ';
        vm.getRepos = getRepos;
        vm.setRepo = setRepo;

        activate();

        function activate()
        {
            common.activateController([getRepos()], controllerId)
                .then(function () { log('Activated Threat Models View'); });
        }

        function getRepos()
        {
            return datacontext.repos().then(function (data) {
                vm.repos = data;
            });
        }
        
        function setRepo(repo) {
            if (repo) {
                vm.repo = repo;
            }
        }
    }
})();