(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'threatmodels';

    // Define the controller on the module.
    // Inject the dependencies. 
    // Point to the controller definition function.
    angular.module('app').controller(controllerId,
        ['common', 'datacontext', 'file', threatModels]);

    function threatModels(common, datacontext, file) {
        // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, 'error');

        // Bindable properties and functions are placed on vm.
        vm.threatModels = [];
        vm.title = 'ThreatModels';
        vm.deleteThreatModel = deleteThreatModel;
        vm.saveThreatModelToFile = saveThreatModelToFile;
        vm.loadThreatModelFromFile = loadThreatModelFromFile;

        activate();

        function activate()
        {
            common.activateController([getThreatModels()], controllerId)
                .then(function () { log('Activated Threat Models View'); });
        }

        function getThreatModels()
        {
            return datacontext.getAllThreatModelDetails().then(function (data) {
                return vm.threatModels = data;
            });
        }

        function deleteThreatModel(index)
        {
            var threatModel = vm.threatModels[index];
            datacontext.deleteThreatModel(threatModel).then(function () { vm.threatModels.splice(index, 1); }, logError );
        }
        function saveThreatModelToFile(index)
        {
            var threatModel = vm.threatModels[index];
            var fileName = threatModel.summary.title.replace(' ', '_') + '.dragon';
            var content = JSON.stringify(threatModel);
            file.saveToFile(fileName, content, 'application/json');
        }

        function loadThreatModelFromFile(content)
        {
            //firefox appear to serialise differently so content is an array..?
            
            var deserialisedContent = JSON.parse(content);
            var threatModel = deserialisedContent[0];
            
            if (angular.isUndefined(threatModel)) {

                threatModel = deserialisedContent

            }

            delete threatModel.summary.id;
            datacontext.saveThreatModel(threatModel).then(null);
        }
    }
})();
