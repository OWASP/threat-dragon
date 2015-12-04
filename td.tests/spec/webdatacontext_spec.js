'use strict';

var webdatacontext;
var mockCommonConfig;
var commonConfig;
var $rootScope;
var $httpBackend;

describe('webdatacontext service:', function () {

    beforeEach(function () {

        angular.mock.module('app');
        angular.mock.module('common');
        angular.mock.inject(function (_$rootScope_, _$httpBackend_, _$window_, _webdatacontext_, _commonConfig_) {
            webdatacontext = _webdatacontext_;
            commonConfig = _commonConfig_;
            $rootScope = _$rootScope_;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET().respond();
        });

        $rootScope.$apply();

    });

    it('request the demo model', function () {

        $httpBackend.expectGET(commonConfig.config.demoModelUrl, {Accept: 'application/json'}).respond();
        webdatacontext.getDemoModel();
        $httpBackend.flush();
        
    });
});