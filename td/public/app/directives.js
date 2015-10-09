(function () {
    'use strict';

    var app = angular.module('app');

    app.directive('tmtFileReadString', [function () {

        var directive = {
            template: '<a href=""><span class="fa fa-folder-open"></span> {{labelText}}</a><input type="file" id="fileReader" style="display: none" />',
            link: link,
            restrict: 'E',
            scope: {
                labelText: '@',
                action: '&'
            }
        };

        return directive;

        function link(scope, element, attrs) {

            var fileSelect = $(element).children("#fileReader");
            fileSelect.on('change', function () { readFile() });

            $(element).click(function (e) {
                if (fileSelect) {
                    fileSelect[0].click();
                }
            });

            function readFile() {
                var reader = new FileReader();
                reader.onloadend = onLoadEnd;
                reader.readAsText(fileSelect[0].files[0]);
                    
                function onLoadEnd()
                {
                    var content = reader.result;
                    scope.action({ content: content });
                }

            }
        }

    }]);

})();


