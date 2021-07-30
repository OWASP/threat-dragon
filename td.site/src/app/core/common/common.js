'use strict';

var commonConfig = function () {
    this.config = {
        controllerActivateSuccessEvent: 'ControllerActivateSuccess',
        demoModelLocation: {
            organisation: 'owasp',
            repo: 'threat-dragon',
            branch: 'main',
            model: 'demo-threat-model'
        }
    };

    this.$get = function () {
        return {
            config: this.config
        };
    };
};

var common = function ($q, $rootScope, commonConfig, logger) {

    var service = {
        // common angular dependencies
        $broadcast: $broadcast,
        // generic
        activateController: activateController,
        logger: logger
    };

    return service;

    function activateController(promises, controllerId) {
        return $q.all(promises).then(function (eventArgs) {
            var data = { controllerId: controllerId };
            $broadcast(commonConfig.config.controllerActivateSuccessEvent, data);
        });
    }

    function $broadcast() {
        return $rootScope.$broadcast.apply($rootScope, arguments);
    }
};

module.exports = {commonModule: common, commonConfig: commonConfig};
