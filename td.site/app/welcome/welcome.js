'use strict';

function welcome($location, common, commonConfig) {

    /*jshint validthis: true */
    var controllerId = 'welcome';
    var vm = this;
    var getLogFn = common.logger.getLogFn;
    var log = getLogFn(controllerId);

    // Bindable properties and functions are placed on vm
    vm.title = 'Welcome';
    vm.loadDemoModel = loadDemoModel;

    activate();

    function activate() {
        common.activateController([], controllerId).then(function () { log('Activated Welcome View'); });
    }

    function loadDemoModel() {
        var loc = 'threatmodel/';
        loc += commonConfig.config.demoModelLocation.organisation + '/';
        loc += commonConfig.config.demoModelLocation.repo + '/';
        loc += commonConfig.config.demoModelLocation.branch + '/';
        loc += commonConfig.config.demoModelLocation.model;
        $location.path(loc);
    }
}

module.exports = welcome;