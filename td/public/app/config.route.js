(function () {
    'use strict';

    var app = angular.module('app');

    // Collect the routes
    app.constant('routes', getRoutes());

    // Configure the routes and route resolvers
    app.config(['$routeProvider', 'routes', routeConfigurator]);
    function routeConfigurator($routeProvider, routes) {

        routes.forEach(function (r) {
            setRoute(r.url, r.config);
        });

        $routeProvider.otherwise({ redirectTo: '/' });

        function setRoute(url, config) {

            $routeProvider.when(url, config);

            return $routeProvider;
        }
    }

    // Define the routes 
    function getRoutes() {
        return [
            {
                url: '/',
                config: {
                    templateUrl: 'app/welcome/welcome.html',
                    title: 'welcome',
                    settings: {
                    }
                }
            }, {
                url: '/welcome',
                config: {
                    templateUrl: 'app/welcome/welcome.html',
                    title: 'welcome',
                    settings: {
                    }
                }
            }, {
                url: '/threatmodels',
                config: {
                    title: 'threatmodels',
                    templateUrl: 'app/threatmodels/threatmodels.html',
                    settings: {
                    }
                }
            }, {
                url: '/threatmodel/:threatModelId',
                config: {
                    title: 'threatmodelsdetail',
                    templateUrl: 'app/threatmodels/threatmodeldetail.html',
                    settings: {
                    }
                }
            }, {
                url: '/threatmodel/edit/:threatModelId',
                config: {
                    title: 'threatmodeledit',
                    templateUrl: 'app/threatmodels/threatmodeledit.html',
                    settings: {
                    }
                }
            }, {
                url: '/threatmodel/report/:threatModelId',
                config: {
                    title: 'threatmodelreport',
                    templateUrl: 'app/report/threatmodelreport.html',
                    settings: {
                    }
                }
            }, {
                url: '/threatmodel/:threatModelId/diagram/:diagramId',
                config: {
                    title: 'diagram',
                    templateUrl: 'app/diagrams/diagrameditor.html',
                    reloadOnSearch: false,
                    settings: {
                    }
                }
            }
        ];
    }
})();

