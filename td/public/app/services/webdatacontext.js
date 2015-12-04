(function () {
    'use strict';

    var serviceId = 'webdatacontext';
    angular.module('app').factory(serviceId,
        ['$q', '$http', 'common', 'commonConfig', webdatacontext]);

    function webdatacontext($q, $http, common, commonConfig) {

        var service = {
            getDemoModel: getDemoModel
        };

        return service;
		
		function getDemoModel()
		{
            var request = {
                method: 'GET',
                headers: {Accept: 'text/plain'},
                url: commonConfig.config.demoModelUrl   
            };
            
			return $http(request);
		}
    }
})();