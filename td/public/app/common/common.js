'use strict';

var commonConfig = function () {
    this.config = {
        controllerActivateSuccessEvent: 'ControllerActivateSuccess',
        demoModelLocation: {
            organisation: 'mike-goodwin',
            repo: 'owasp-threat-dragon-demo',
            branch: 'master',
            model: 'Demo Threat Model'
        }
    };

    this.$get = function () {
        return {
            config: this.config
        };
    };
}

var common = function ($q, $rootScope, commonConfig, logger) {

    var service = {
        // common angular dependencies
        $broadcast: $broadcast,
        // generic
        activateController: activateController,
        logger: logger,
        utils: { stringToFunction: stringToFunction }
    };

    return service;

    function stringToFunction(str) {
        var arr = str.split(".");
        /*jshint validthis: true */
        var fn = (window || this);
        for (var i = 0, len = arr.length; i < len; i++) {
            fn = fn[arr[i]];
        }

        if (typeof fn !== "function") {
            throw new Error("function not found");
        }

        return fn;
    }


    function activateController(promises, controllerId) {
        return $q.all(promises).then(function (eventArgs) {
            var data = { controllerId: controllerId };
            $broadcast(commonConfig.config.controllerActivateSuccessEvent, data);
        });
    }

    function $broadcast() {
        return $rootScope.$broadcast.apply($rootScope, arguments);
    }
}

module.exports = {commonModule: common, commonConfig: commonConfig};