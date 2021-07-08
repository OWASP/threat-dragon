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
                templateUrl: './app/welcome/welcome.html',
                title: 'Welcome Page',
                settings: {
                }
            }
        }, {
            url: '/welcome',
            config: {
                templateUrl: './app/welcome/welcome.html',
                title: 'Welcome Page',
                settings: {
                }
            }
        },{
            url: '/threatmodel/new',
            config: {
                templateUrl: 'threatmodels/threatmodeledit.html',
                title: 'New Threat Model Page',
                settings: {
                }
            }
        },{
            url: '/threatmodel/edit/:location',
            config: {
                templateUrl: 'threatmodels/threatmodeledit.html',
                title: 'Threat Model Edit Page',
                settings: {
                }
            }
        }, {
            url: '/threatmodel/export/:location',
            config: {
                templateUrl: './app/threatmodels/pdfexport.html',
                title: 'Threat Model Export',
                settings: {
                }
            }
        }, {
            url: '/threatmodel/report/:location',
            config: {
                templateUrl: './app/threatmodels/desktopreport.html',
                title: 'Threat Model Report',
                settings: {
                }
            }
        }, {
            url: '/threatmodel/:location',
            config: {
                templateUrl: 'threatmodels/threatmodeldetail.html',
                title: 'Threat Model Page',
                settings: {
                }
            }
        }, {
            url: '/threatmodel/:location/diagram/:diagramId',
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
