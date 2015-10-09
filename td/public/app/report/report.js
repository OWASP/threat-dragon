(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'report';

    // Define the controller on the module.
    // Inject the dependencies. 
    // Point to the controller definition function.
    angular.module('app').controller(controllerId,
        ['$routeParams', '$window', 'common', 'datacontext', 'diagramming', report]);

    function report($routeParams, $window, common, datacontext, diagramming) {
        // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        // Bindable properties and functions are placed on vm.
        vm.title = 'Report';
        vm.threatModel = {};
        vm.print = print;
        vm.initialise = initialise;


        activate();

        function activate() {
            common.activateController([getThreatModel()], controllerId).then(function () { log('Activated Report View'); });
        }

        function getThreatModel()
        {
            return datacontext.getThreatModelDetail($routeParams.threatModelId).then(function (data) {
                vm.threatModel = data;

                vm.threatModel.detail.diagrams.forEach(function (diagram)
                {
                    var graph = diagramming.newGraph();
                    graph.diagramId = diagram.id;
                    diagram.graph = graph;
                })
            });
        }

        function initialise(diagram)
        {
            datacontext.getThreatModelDiagram(vm.threatModel.summary.id, diagram.model.diagramId).then(onGetThreatModelDiagram, onError);

            function onGetThreatModelDiagram(data)
            {
                diagramming.initialise(diagram.model, data.diagramJson);
                diagramming.scaleContent(diagram, { maxScale: 4 });
                diagram.model.attributes.cells.models.forEach(function (element) { getElementProperties(diagram.model.diagramId, element) });
            }
        }

        function getElementProperties(diagramId, element)
        {
            datacontext.getElementProperties(diagramId, element.id).then(function (data) {
                element.properties = data
            });
        }
        
        function print()
        {
            $window.print();
        }

        function onError(error) {
            vm.loaded = false;
            logError(error);
        }
    }
})();
