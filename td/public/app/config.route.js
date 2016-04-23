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
                    templateUrl: './public/app/welcome/welcome.html',
                    title: 'welcome',
                    settings: {
                    }
                }
            }, {
                url: '/welcome',
                config: {
                    templateUrl: './public/app/welcome/welcome.html',
                    title: 'welcome',
                    settings: {
                    }
                }
            }, {
                url: '/threatmodel/github',
                config: {
                    templateUrl: './public/app/threatmodels/github.html',
                    title: 'github',
                    settings: {
                    }
                }
            },{
                url: '/threatmodel/:organisation/:repo/:branch/:model',
                config: {
                    title: 'Threat Model Details',
                    templateUrl: './public/app/threatmodels/threatmodeldetail.html',
                    settings: {
                    }
                }
            }, {
                url: '/threatmodel/edit/:organisation/:repo/:branch/:model',
                config: {
                    title: 'Edit Threat Model',
                    templateUrl: './public/app/threatmodels/threatmodeledit.html',
                    settings: {
                    }
                }
            }, {
                url: '/threatmodel/edit/new',
                config: {
                    title: 'Edit New Model',
                    templateUrl: './public/app/threatmodels/threatmodeledit.html',
                    settings: {
                    }
                }
            }, {
                url: '/threatmodel/:organisation/:repo/:branch/:model/diagram/:diagramId',
                config: {
                    title: 'diagram',
                    templateUrl: './public/app/diagrams/diagrameditor.html',
                    reloadOnSearch: false,
                    settings: {
                    }
                }
            }
        ];
    }
})();

