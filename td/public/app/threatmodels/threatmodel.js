(function ()
{
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'threatmodel';

    // Define the controller on the module.
    // Inject the dependencies. 
    // Point to the controller definition function.
    angular.module('app').controller(controllerId,
        ['$rootScope','$scope', '$location','$routeParams', 'dialogs', 'common', 'datacontext', threatModel]);

    function threatModel($rootScope, $scope, $location, $routeParams, dialogs, common, datacontext)
    {
        // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
        /*jshint validthis: true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, 'error');

        // Bindable properties and functions are placed on vm.
        vm.title = 'ThreatModelDetail';
        vm.threatModel = {};
        vm.removeContributor = removeContributor;
        vm.addContributor = addContributor;
        vm.removeDiagram = removeDiagram;
        vm.addDiagram = addDiagram;
        vm.save = save;
        vm.reload = reload,
        /*jshint -W030 */
        vm.deleteModel = deleteModel;
        vm.cancel = cancel;
        vm.newContributor = '';
        vm.addingContributor = false;
        vm.cancelAddingContributor = cancelAddingContributor;
        vm.startAddingContributor = startAddingContributor;
        vm.newDiagram = emptyDiagram();
        vm.addingDiagram = false;
        vm.cancelAddingDiagram = cancelAddingDiagram;
        vm.startAddingDiagram = startAddingDiagram;

        //structured exit
        $scope.$watch(function () { if (angular.isDefined(vm.threatModelEditForm)) { return vm.threatModelEditForm.$dirty; }}, function (dirty) {
            if (angular.isDefined(dirty)) { vm.dirty = dirty; }
        });

        $scope.$on('$locationChangeStart',
            function (event, current, previous)
            {
                if (vm.dirty) {
                    dialogs.structuredExit(event, function () { }, function () { vm.dirty = false; });
                }
            });

        activate();

        function activate()
        {
            common.activateController([getThreatModel()], controllerId)
                .then(function () { log('Activated Threat Model Detail View'); });
        }

        function getThreatModel()
        {
            if ($routeParams.threatModelId === 'new')
            {
                vm.threatModel = { summary: {}, detail: { contributors: [], diagrams: [] } };
                return vm.threatModel;
            }

            return datacontext.getThreatModelDetail($routeParams.threatModelId).then(function (data) {

                if (vm.threatModelEditForm)
                {
                    vm.threatModelEditForm.$setPristine();
                }
                else {
                    vm.dirty = false;
                }

                vm.threatModel = data;
                return vm.threatModel;
            });
        }

        function save()
        {
            datacontext.saveThreatModel(vm.threatModel).then(function () {
                vm.dirty = false; //prevents structured exit
                $location.path('/threatmodels');
            });
        }

        function reload()
        {
            if (vm.dirty)
            {
                dialogs.confirm('./app/threatmodels/confirmReloadOnDirty.html', getThreatModel, function () { return null; }, function () { });
            }
            else
            {
                getThreatModel();
            }
        }

        function deleteModel()
        {
            datacontext.deleteThreatModel(vm.threatModel).then(onDelete, logError);
        }

        function onDelete()
        {
            vm.dirty = false;
            $location.path('/threatmodels');
        }

        function cancel()
        {
            if (vm.threatModel.summary.id)
            {
                $location.path('/threatmodel/' + vm.threatModel.summary.id);
            }
            else
            {
                $location.path('/threatmodels');
            } 
        }

        function removeContributor(index)
        {
            vm.threatModel.detail.contributors.splice(index, 1);
            vm.dirty = true;
        }

        function removeDiagram(index)
        {
            vm.threatModel.detail.diagrams.splice(index, 1);
            vm.dirty = true;
        }

        function addContributor()
        {
            vm.threatModel.detail.contributors.push({ name: vm.newContributor });
            vm.newContributor = '';
            vm.addingContributor = false;
            vm.dirty = true;
        }

        function cancelAddingContributor() {
            vm.addingContributor = false;
            vm.newContributor = '';
        }

        function startAddingContributor() {
            vm.addingContributor = true;
        }

        function addDiagram()
        {
            vm.newDiagram.id = vm.threatModel.detail.diagrams.length;
            vm.threatModel.detail.diagrams.push(vm.newDiagram);
            vm.newDiagram = emptyDiagram();
            vm.addingDiagram = false;
            vm.dirty = true;
        }

        function cancelAddingDiagram()
        {
            vm.addingDiagram = false;
            vm.newDiagram = emptyDiagram();
        }

        function startAddingDiagram()
        {
            vm.addingDiagram = true;
        }

        function emptyDiagram()
        {
            return { title: '', thumbnail: "../../content/images/thumbnail.jpg" };
        }
    }
})();
