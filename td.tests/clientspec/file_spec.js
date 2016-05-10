'use strict';

var file;
var $rootScope;
var $httpBackend;
var $window;

describe('file service:', function () {

    //MouseEvent not supported in PhantomJS v1.9.x - need to wait for v2.x on Windows
    if (navigator.userAgent.indexOf('PhantomJS') < 0) {

        var isIE;  

        beforeEach(function () {

            angular.mock.module('app');
            angular.mock.inject(function (_$rootScope_, _$httpBackend_, _$window_, _file_) {
                file = _file_;
                $rootScope = _$rootScope_;
                $window = _$window_;
                $httpBackend = _$httpBackend_;
                $httpBackend.expectGET().respond();
            });

            $rootScope.$apply();

            isIE = false;

            if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
                isIE = true;
            }

            if (isIE) {

                spyOn($window.navigator, 'msSaveOrOpenBlob');

            } else {

                spyOn($window.URL, 'createObjectURL').and.callThrough();

            }

        });

        it('process should save content to a file with default settings', function () {

            file.saveToFile();

            if (isIE) {

                expect($window.navigator.msSaveOrOpenBlob).toHaveBeenCalled();
                expect($window.navigator.msSaveOrOpenBlob.calls.argsFor(0)[1]).toEqual('download.txt');
                var content = $window.navigator.msSaveOrOpenBlob.calls.argsFor(0)[0];
                expect(content instanceof Blob).toBe(true);
                expect(content.type).toEqual('text/plain');
                expect(content.size).toEqual(0);

            } else {

                //needs more expectations - maybe better suited to E2E test
                expect($window.URL.createObjectURL).toHaveBeenCalled();
                var content = $window.URL.createObjectURL.calls.argsFor(0)[0];
                expect(content instanceof Blob).toBe(true);
                expect(content.type).toEqual('text/plain');
                expect(content.size).toEqual(0);

            }
        });

        it('process should save content to a file with specified settings', function () {

            var inputContent = 'content';
            var contentType = 'contenttype';
            var filename = 'filename';

            file.saveToFile(filename, inputContent, contentType);

            if (isIE) {

                expect($window.navigator.msSaveOrOpenBlob).toHaveBeenCalled();
                expect($window.navigator.msSaveOrOpenBlob.calls.argsFor(0)[1]).toEqual(filename);
                var content = $window.navigator.msSaveOrOpenBlob.calls.argsFor(0)[0];
                expect(content instanceof Blob).toBe(true);
                expect(content.type).toEqual(contentType);
                expect(content.size).toEqual(inputContent.length);

            } else {

                //needs more expectations - maybe better suited to E2E test
                expect($window.URL.createObjectURL).toHaveBeenCalled();
                var content = $window.URL.createObjectURL.calls.argsFor(0)[0];
                expect(content instanceof Blob).toBe(true);
                expect(content.type).toEqual(contentType);
                expect(content.size).toEqual(inputContent.length);
            }
        });

    } else {

        console.log('Skipping file download tests - PhantomJS does not support MouseEvent');

    }
});