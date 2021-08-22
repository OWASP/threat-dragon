'use strict';

function routemediator($rootScope, $location, config, logger) {

    // Define the functions and properties to reveal.
    var handleRouteChangeError = false;
    var service = {
        setRoutingHandlers: setRoutingHandlers,
    };

    return service;

    function setRoutingHandlers() {
        updateDocTitle();
        handleRoutingErrors();
    }

    function handleRoutingErrors() {
        $rootScope.$on('$routeChangeError',
            function (event, current, previous, rejection) {

                if (handleRouteChangeError) {
                    return;
                }

                handleRouteChangeError = true;
                var msg = 'Error routing: ' + (current && current.name);
                logger.logWarning(msg, current, 'routemediator', true);
                $location.path('/');
            });
    }

    function updateDocTitle() {
        $rootScope.$on('$routeChangeSuccess',
            function (event, current, previous) {
                handleRouteChangeError = false;
                var title = config.docTitle + ' ' + (current.title || '');
                $rootScope.title = title;
            });
    }
}

module.exports = routemediator;