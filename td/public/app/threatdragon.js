(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function () {
    'use strict';
    
    
    //temporary fix for Chrome/Jointjs problem
    SVGElement.prototype.getTransformToElement = SVGElement.prototype.getTransformToElement || function(toElement) {
        return toElement.getScreenCTM().inverse().multiply(this.getScreenCTM());
    };

    var app = angular.module('app', ['ui.bootstrap', 'ngRoute', 'common', 'xeditable']);

    app.run(['$rootScope', '$location',
    function ($rootScope, $location) { 
        $rootScope.location = $location;
    }]);

    // Handle routing errors and success events
    app.run(['$route', '$rootScope', 'routemediator',
    function ($route, $rootScope, routemediator) {
        routemediator.setRoutingHandlers();
    }]);
    
    //config for angular-xeditable
    app.run(function(editableOptions) {
        editableOptions.theme = 'bs3';
    });

})();
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ0ZC9wdWJsaWMvYXBwL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBcclxuICAgIFxyXG4gICAgLy90ZW1wb3JhcnkgZml4IGZvciBDaHJvbWUvSm9pbnRqcyBwcm9ibGVtXHJcbiAgICBTVkdFbGVtZW50LnByb3RvdHlwZS5nZXRUcmFuc2Zvcm1Ub0VsZW1lbnQgPSBTVkdFbGVtZW50LnByb3RvdHlwZS5nZXRUcmFuc2Zvcm1Ub0VsZW1lbnQgfHwgZnVuY3Rpb24odG9FbGVtZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIHRvRWxlbWVudC5nZXRTY3JlZW5DVE0oKS5pbnZlcnNlKCkubXVsdGlwbHkodGhpcy5nZXRTY3JlZW5DVE0oKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJywgWyd1aS5ib290c3RyYXAnLCAnbmdSb3V0ZScsICdjb21tb24nLCAneGVkaXRhYmxlJ10pO1xyXG5cclxuICAgIGFwcC5ydW4oWyckcm9vdFNjb3BlJywgJyRsb2NhdGlvbicsXHJcbiAgICBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJGxvY2F0aW9uKSB7IFxyXG4gICAgICAgICRyb290U2NvcGUubG9jYXRpb24gPSAkbG9jYXRpb247XHJcbiAgICB9XSk7XHJcblxyXG4gICAgLy8gSGFuZGxlIHJvdXRpbmcgZXJyb3JzIGFuZCBzdWNjZXNzIGV2ZW50c1xyXG4gICAgYXBwLnJ1bihbJyRyb3V0ZScsICckcm9vdFNjb3BlJywgJ3JvdXRlbWVkaWF0b3InLFxyXG4gICAgZnVuY3Rpb24gKCRyb3V0ZSwgJHJvb3RTY29wZSwgcm91dGVtZWRpYXRvcikge1xyXG4gICAgICAgIHJvdXRlbWVkaWF0b3Iuc2V0Um91dGluZ0hhbmRsZXJzKCk7XHJcbiAgICB9XSk7XHJcbiAgICBcclxuICAgIC8vY29uZmlnIGZvciBhbmd1bGFyLXhlZGl0YWJsZVxyXG4gICAgYXBwLnJ1bihmdW5jdGlvbihlZGl0YWJsZU9wdGlvbnMpIHtcclxuICAgICAgICBlZGl0YWJsZU9wdGlvbnMudGhlbWUgPSAnYnMzJztcclxuICAgIH0pO1xyXG5cclxufSkoKTsiXX0=
