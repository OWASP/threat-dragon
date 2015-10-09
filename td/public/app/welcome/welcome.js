(function () {
    'use strict';

    // Controller name is handy for logging.
    var controllerId = 'welcome';

    // Define the controller on the module.
    // Inject the dependencies. 
    // Point to the controller definition function.
    angular.module('app').controller(controllerId,
        ['dialogs', 'common', 'datacontext', welcome]);

    function welcome(dialogs, common, datacontext) {
        // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        // Bindable properties and functions are placed on vm
        vm.title = 'Welcome';
        vm.clearLocalStorage = clearLocalStorage;
        vm.threatModelCount = 0;

        activate();

        function activate()
        {
            common.activateController([welcome()], controllerId).then(function () { log('Activated Welcome View'); });
        }

        function welcome()
        {
            getThreatModelCount();
        }

        function clearLocalStorage()
        {
            dialogs.confirm('./app/welcome/confirmClearLocalStorage.html', executeClearLocalStorage, function () { return vm.threatModelCount; }, function () { });
        }

        function executeClearLocalStorage()
        {
            datacontext.clearStorage().then(function () { getThreatModelCount(); });
        }

        function getThreatModelCount()
        {
            datacontext.getThreatModelCount().then(function (count) { vm.threatModelCount = count; });
        }
    }
})();
