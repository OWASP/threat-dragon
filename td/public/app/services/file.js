(function () {
    'use strict';
    
    // Factory name is handy for logging
    var serviceId = 'file';
    
    // Define the factory on the module.
    // Inject the dependencies. 
    // Point to the factory definition function.
    angular.module('app').factory(serviceId, ['$window', file]);
    
    function file($window) {
        
        // Define the functions and properties to reveal.
        var service = {
            saveToFile: saveToFile
        };
        
        return service;
        
        function saveToFile(fileName, content, contentType) {

            //based on SeaSponge (https://github.com/mozilla/seasponge)
            
            //defaults
            var validatedContentType = contentType || 'text/plain';
            var validatedFileName = fileName || 'download.txt';
            var validatedContent = content || '';

            //Create Blob
            var blob;

            if (validatedContent instanceof Blob) {
                blob = validatedContent;
            }                
            else {
                blob = new Blob([validatedContent], { type: validatedContentType });
            }
            
            //need handle differently for IE
            var isIE = false;
            if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
                isIE = true;
            }
            
            if (isIE) {
                window.navigator.msSaveOrOpenBlob(blob, validatedFileName);
            }
            else {
                var url = $window.URL.createObjectURL(blob);
                
                //Create link
                var link = $('<a>', { download: validatedFileName, href: url }).append('body')[0];
                var event;
                event = new MouseEvent('click');
                link.dispatchEvent(event);
            }
        }
    }
})();