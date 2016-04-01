(function () {
    'use strict';

    var controllerId = 'shell';
    angular.module('app').controller(controllerId,
        ['$rootScope', '$location', '$cookies', 'common', 'config', shell]);

    function shell($rootScope, $location, $cookies, common, config) {
        /*jshint validthis: true */
        var vm = this;
        var logSuccess = common.logger.getLogFn(controllerId, 'success');
        var events = config.events;
        vm.isLoggedIn = ($cookies.get('idp') === 'github');
        vm.csrfToken = $cookies.get('XSRF-TOKEN');

        activate();

        function activate()
        {
            if (angular.isDefined($location.search().suppressbanner))
            {
                vm.suppressBanner = $location.search().suppressbanner;
            }
            else
            {
                vm.suppressBanner = false;
            }

            logSuccess('Threat Modelling application loaded!', null, true);
            common.activateController([], controllerId);
        }

        function toggleSpinner(on) { vm.isBusy = on; }

        $rootScope.$on('$routeChangeStart',
            function (event, next, current) { }
        );
        
        $rootScope.$on(events.controllerActivateSuccess,
            function (data) { }
        );
    }
})();