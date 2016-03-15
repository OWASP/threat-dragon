(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'threatmodels';

    // Define the controller on the module.
    // Inject the dependencies. 
    // Point to the controller definition function.
    angular.module('app').controller(controllerId,
        ['$location', 'common', 'datacontext', 'webdatacontext', 'file', threatModels]);

    function threatModels($location, common, datacontext, webdatacontext, file) {
        // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
        /*jshint validthis: true */
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
        vm.loadDemoModel = loadDemoModel;
        vm.addNewDiagram = addNewDiagram;

        activate();

        function activate()
        {
            common.activateController([getThreatModels()], controllerId)
                .then(function () { log('Activated Threat Models View'); });
        }

        function getThreatModels()
        {
            return datacontext.getAllThreatModelDetails().then(function (data) {
                vm.threatModels = data;
            });
        }

        function deleteThreatModel(index)
        {
            datacontext.deleteThreatModel(index);
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

                threatModel = deserialisedContent;

            }

            loadThreatModel(threatModel);
        }
        
        function loadThreatModel(threatModel)
        {
            delete threatModel.summary.id;
            datacontext.saveThreatModel(threatModel).then(null);               
        }
        
        function loadDemoModel()
        {
            webdatacontext.getDemoModel().then(function(response){ loadThreatModel(response.data);}, function(response) { onError(response); });
        
            function onError(response)
            {
                logError('Error loading demo model: ' + response.status + '(' + response.statusText + ')');
            }
        }
        
        function addNewDiagram(index)
        {
            var threatModel = vm.threatModels[index];
            var newDiagramId = threatModel.detail.diagrams.length;
            threatModel.detail.diagrams.push({ id: newDiagramId, title: 'New diagram', thumbnail: "../public/content/images/thumbnail.jpg" });
            datacontext.saveThreatModel(threatModel).then(function() {
                $location.path('threatmodel/'+ threatModel.summary.id + '/diagram/' + newDiagramId);
            });
            
        }
    }
})();