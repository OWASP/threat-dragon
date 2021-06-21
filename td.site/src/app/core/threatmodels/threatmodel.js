'use strict';

var _ = require('lodash');

function threatModel($scope, $location, $routeParams, dialogs, common, datacontext, threatmodellocator) {
    // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
    /*jshint validthis: true */
    var vm = this;
    var controllerId = 'threatmodel';
    var getLogFn = common.logger.getLogFn;
    var log = getLogFn(controllerId);
    var logError = getLogFn(controllerId, 'error');

    // Bindable properties and functions are placed on vm.
    vm.errored = false;
    vm.title = 'Threat Model Details';
    vm.threatModel = {};
    vm.removeContributor = removeContributor;
    vm.addContributor = addContributor;
    vm.removeDiagram = removeDiagram;
    vm.duplicateDiagram = duplicateDiagram;
    vm.addDiagram = addDiagram;
    vm.save = save;
    vm.create = create;
    vm.reload = reload,
    /*jshint -W030 */
    vm.threatModelPath = threatModelPath;
    vm.threatModelLocation = threatModelLocation;
    vm.willMoveThreatModel = willMoveThreatModel;
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
    vm.newID = newID;
    vm.isNewModel = isNewModel;

    //structured exit
    $scope.$watch(function () { if (!_.isUndefined(vm.threatModelEditForm)) { return vm.threatModelEditForm.$dirty; } }, function (dirty) {
        if (!_.isUndefined(dirty)) { vm.dirty = dirty; }
    });

    $scope.$on('$locationChangeStart',
        function (event, current, previous) {
            if (vm.dirty) {
                dialogs.structuredExit(event, function () { }, function () { vm.dirty = false; });
            }
        });

    activate();

    function activate() {
        common.activateController([getThreatModel()], controllerId)
            .then(function () { log('Activated Threat Model Detail View'); });
    }

    function getThreatModel(forceReload) {
        //creating new model
        if (isNewModel()) {
            vm.threatModel = { summary: {}, detail: { contributors: [], diagrams: [] } };
            datacontext.threatModel = vm.threatModel;
            return vm.threatModel;
        }

        var location = threatmodellocator.getModelLocation($routeParams);

        return datacontext.load(location, forceReload).then(onLoad, onError);

        function onLoad(data) {

            if (vm.threatModelEditForm) {
                vm.threatModelEditForm.$setPristine();
            }
            else {
                vm.dirty = false;
            }

            vm.threatModel = data;
            return vm.threatModel;
        }
    }

    function save() {

        datacontext.update().then(onSave, onError);

        function onSave(result) {
            vm.dirty = false; //prevents structured exit
            $location.path('/threatmodel/' + threatmodellocator.getModelPath(result.location));
        }
    }

    function create() {
        datacontext.create($routeParams, vm.threatModel).then(onCreate, onError);

        function onCreate(result) {
            vm.dirty = false; //prevents structured exit
            $location.path('/threatmodel/' + threatmodellocator.getModelPath(result.location));
        }
    }

    function reload() {
        if (vm.dirty) {
            dialogs.confirm('threatmodels/confirmReloadOnDirty.html', function () { getThreatModel(true); }, function () { return null; }, function () { });
        }
        else {
            getThreatModel(true);
        }

    }

    function threatModelPath() {
        return threatmodellocator.getModelPathFromRouteParams($routeParams);
    }

    function threatModelLocation() {
        return threatmodellocator.getModelLocation($routeParams);
    }

    function willMoveThreatModel(changes) {
        return threatmodellocator.willMoveModel($routeParams, changes);
    }

    function deleteModel() {
        dialogs.confirm('threatmodels/confirmDelete.html', function () {
                datacontext.deleteModel().then(onDelete, logError);
            }, function () {
                return null;
            }, function () { });
    }

    function onDelete() {
        vm.dirty = false;
        $location.path('/');
    }

    function cancel() {
        if (!_.isUndefined(vm.threatModel.summary.title)) {
            $location.path('/threatmodel/' + vm.threatModelPath());
        }
        else {
            $location.path('/');
        }
    }

    function removeContributor(index) {
        vm.threatModel.detail.contributors.splice(index, 1);
        vm.dirty = true;
    }

    function removeDiagram(index) {
        vm.threatModel.detail.diagrams.splice(index, 1);
        vm.dirty = true;
        //the ids must be in numerical order, otherwise diagrams are not indexed correctly
        var id = 0;
        vm.threatModel.detail.diagrams.forEach(function (item) {
            item.id = id;
            id += 1;
        });
    }

    function duplicateDiagram(index) {
        var duplicatedDiagram = angular.copy(vm.threatModel.detail.diagrams[index]);
        vm.newDiagram.title = "Copy of " + duplicatedDiagram.title;
        vm.newDiagram.id = newID();
        vm.newDiagram.diagramJson = duplicatedDiagram.diagramJson;
        vm.newDiagram.size = duplicatedDiagram.size;
        if (duplicatedDiagram.diagramType != null && duplicatedDiagram.thumbnail != null) {
            vm.newDiagram.diagramType = duplicatedDiagram.diagramType;
            vm.newDiagram.thumbnail = duplicatedDiagram.thumbnail;
        }
        vm.threatModel.detail.diagrams.push(vm.newDiagram);
        vm.newDiagram = emptyDiagram();
        vm.addingDiagram = false;
        vm.dirty = true;
    }

    function addContributor() {
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

    function addDiagram() {
        vm.newDiagram.id = newID();
        vm.threatModel.detail.diagrams.push(vm.newDiagram);
        vm.newDiagram = emptyDiagram();
        vm.addingDiagram = false;
        vm.dirty = true;
    }

    function cancelAddingDiagram() {
        vm.addingDiagram = false;
        vm.newDiagram = emptyDiagram();
    }

    function startAddingDiagram() {
        vm.addingDiagram = true;
    }

    function emptyDiagram() {
        return { title: '', thumbnail: './public/content/images/thumbnail.stride.jpg', diagramType: 'STRIDE' };
    }

    function isNewModel() {
        return $location.path().substr(0, 16) === threatmodellocator.newModelLocation;
    }

    function newID() {
        // find an empty slot in the array of IDs, or add to the end
        var id = 0;
        vm.threatModel.detail.diagrams.forEach(function (item) {
            if (id == item.id) {
                id += 1;
            }
        });
        return id;
    }

    function onError(err) {
        vm.errored = true;
        logError(err.data.message);
    }
}

module.exports = threatModel;
