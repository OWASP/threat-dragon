'use strict';

var app = require('angular').module('app');

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
                title: 'Welcome Page',
                settings: {
                }
            }
        }, {
            url: '/welcome',
            config: {
                templateUrl: './public/app/welcome/welcome.html',
                title: 'Welcome Page',
                settings: {
                }
            }
        }, {
            url: '/threatmodel',
            config: {
                templateUrl: './public/app/threatmodels/repos.html',
                title: 'Choose a Repo',
                settings: {
                }
            }
        }, {
            url: '/threatmodel/:organisation/:repo',
            config: {
                templateUrl: './public/app/threatmodels/branches.html',
                title: 'Choose a Branch',
                settings: {
                }
            }
        }, {
            url: '/threatmodel/:organisation/:repo/:branch',
            config: {
                templateUrl: './public/app/threatmodels/models.html',
                title: 'Choose a Model',
                settings: {
                }
            }
        }, {
            url: '/threatmodel/:organisation/:repo/:branch/:model',
            config: {
                title: 'Threat Model Details',
                templateUrl: 'threatmodels/threatmodeldetail.html',
                settings: {
                }
            }
        }, {
            url: '/threatmodel/edit/:organisation/:repo/:branch/:model',
            config: {
                title: 'Edit Threat Model',
                templateUrl: 'threatmodels/threatmodeledit.html',
                settings: {
                }
            }
        }, {
            url: '/new/threatmodel',
            config: {
                title: 'Choose a Repo For Your New Model',
                templateUrl: './public/app/threatmodels/repos.html',
                settings: {
                }
            }
        }, {
            url: '/new/threatmodel/:organisation/:repo',
            config: {
                title: 'Choose a Branch For Your New Model',
                templateUrl: './public/app/threatmodels/branches.html',
                settings: {
                }
            }
        }, {
            url: '/new/threatmodel/:organisation/:repo/:branch',
            config: {
                title: 'Create a New Model',
                templateUrl: 'threatmodels/threatmodeledit.html',
                settings: {
                }
            }
        }, {
            url: '/threatmodel/:organisation/:repo/:branch/:model/diagram/:diagramId',
            config: {
                title: 'Threat Model Diagram',
                templateUrl: 'diagrams/diagrameditor.html',
                reloadOnSearch: false,
                settings: {
                }
            }
        }
    ];
}
