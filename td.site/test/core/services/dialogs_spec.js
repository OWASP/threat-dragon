'use strict';

describe('dialogs service:', function () {

    var dialogs;
    var mockLocation;
    var mockModal;

    var modalResult = 'modal result';

    mockLocation = {
        path: function () { }
    };

    mockModal = {
        open: function () {
            return { result: modalResult };
        }
    };

    var mockEvent = {
        preventDefault: function () { }
    };

    beforeEach(function () {

        dialogs = require('/td.site/src/app/core/services/dialogs')(mockLocation, mockModal);

    });

    it('should expose two functions', function () {

        expect(dialogs.confirm instanceof Function).toBe(true);
        expect(dialogs.structuredExit instanceof Function).toBe(true);

    });

    it('should open the structured exit modal', function () {

        spyOn(mockEvent, 'preventDefault');
        spyOn(mockModal, 'open').and.callThrough();;
        var result = dialogs.structuredExit(mockEvent);
        expect(result).toEqual(modalResult);
        expect(mockModal.open).toHaveBeenCalled();
        expect(mockEvent.preventDefault).toHaveBeenCalled();

    });

    it('should resolve $location.path()', function () {

        spyOn(mockModal, 'open').and.callThrough();
        var result = dialogs.structuredExit(mockEvent);
        var resolve = mockModal.open.calls.argsFor(0)[0].resolve;
        spyOn(mockLocation, 'path');
        resolve.destination();
        expect(mockLocation.path).toHaveBeenCalled();

    });

    it('should resolve cancel', function () {

        spyOn(mockModal, 'open').and.callThrough();
        var cancel = jasmine.createSpy('cancel');
        var result = dialogs.structuredExit(mockEvent, cancel);
        var resolve = mockModal.open.calls.argsFor(0)[0].resolve;
        expect(resolve.cancel()).toEqual(cancel);

    });

    it('should resolve ok', function () {

        spyOn(mockModal, 'open').and.callThrough();
        var ok = jasmine.createSpy('ok');
        var result = dialogs.structuredExit(mockEvent, null, ok);
        var resolve = mockModal.open.calls.argsFor(0)[0].resolve;
        expect(resolve.ok()).toEqual(ok);

    });

    it('should open the confirm dialog', function () {

        spyOn(mockModal, 'open').and.callThrough();;
        var result = dialogs.confirm();
        expect(result).toEqual(modalResult);
        expect(mockModal.open).toHaveBeenCalled();

    });

    it('should open the confirm dialog with specified class', function () {

        var windowClass = 'window class';
        spyOn(mockModal, 'open').and.callThrough();;
        var result = dialogs.confirm(null, null, null, null, windowClass);
        expect(result).toEqual(modalResult);
        expect(mockModal.open.calls.argsFor(0)[0].windowClass).toEqual(windowClass);

    });

    it('should resolve cancel', function () {

        spyOn(mockModal, 'open').and.callThrough();
        var cancel = jasmine.createSpy('cancel');
        var result = dialogs.confirm(null, null, null, cancel);
        var resolve = mockModal.open.calls.argsFor(0)[0].resolve;
        expect(resolve.cancel()).toEqual(cancel);

    });

    it('should resolve parameter', function () {

        spyOn(mockModal, 'open').and.callThrough();
        var parameter = jasmine.createSpy('parameter');
        var result = dialogs.confirm(null, null, parameter);
        var resolve = mockModal.open.calls.argsFor(0)[0].resolve;
        expect(resolve.parameter()).toEqual(parameter);

    });

    it('should resolve ok', function () {

        spyOn(mockModal, 'open').and.callThrough();
        var ok = jasmine.createSpy('ok');
        var result = dialogs.confirm(null, ok);
        var resolve = mockModal.open.calls.argsFor(0)[0].resolve;
        expect(resolve.ok()).toEqual(ok);

    });

});

describe('dialogs controllers:', function () {

    var mockLocation = {
        path: function () { }
    };
    var mockScope = {};
    var mockUibModalInstance = {
        dismiss: function () { },
        close: function () { }
    };

    var controllers = require('/td.site/src/app/core/services/dialogControllers');

    describe('structured exit', function () {

        var cancel;
        var ok;
        var destination = 'destination';

        beforeEach(function () {

            cancel = jasmine.createSpy('cancel');
            ok = jasmine.createSpy('ok');
            controllers.structuredExitController(mockScope, mockUibModalInstance, mockLocation, destination, cancel, ok);
            spyOn(mockUibModalInstance, 'dismiss');
            spyOn(mockUibModalInstance, 'close');
            spyOn(mockLocation, 'path');

        });

        it('should ok', function () {

            mockScope.onOK();
            expect(ok).toHaveBeenCalled();
            expect(ok.calls.argsFor(0)).toEqual([destination]);
            expect(mockUibModalInstance.close).toHaveBeenCalled();
            expect(cancel).not.toHaveBeenCalled();
            expect(mockUibModalInstance.dismiss).not.toHaveBeenCalled();
            expect(mockLocation.path.calls.argsFor(0)).toEqual([destination]);

        });

        it('should cancel', function () {

            mockScope.onCancel();
            expect(cancel).toHaveBeenCalled();
            expect(cancel.calls.argsFor(0)).toEqual([destination]);
            expect(mockUibModalInstance.dismiss).toHaveBeenCalled();
            expect(ok).not.toHaveBeenCalled();
            expect(mockUibModalInstance.close).not.toHaveBeenCalled();
            expect(mockLocation.path).not.toHaveBeenCalled();

        });

    });

    describe('confirm - defined parameters', function () {

        var cancel;
        var ok;
        var param;
        var parameter;

        beforeEach(function () {

            param = 'param';
            parameter = function() { return param;};
            cancel = jasmine.createSpy('cancel');
            ok = jasmine.createSpy('ok');
            controllers.confirmController(mockScope, mockUibModalInstance, ok, cancel, parameter);
            spyOn(mockUibModalInstance, 'dismiss');
            spyOn(mockUibModalInstance, 'close');

        });

        it('should set scope fields', function () {

            expect(mockScope.parameter).toBeDefined();
            expect(mockScope.applyToAll).toBe(false);

        });

        it('should ok', function () {

            mockScope.onOK(param);
            expect(mockUibModalInstance.close).toHaveBeenCalled();
            expect(ok.calls.argsFor(0)).toEqual([param]);
            expect(cancel).not.toHaveBeenCalled();

        });

        it('should cancel', function () {

            mockScope.onCancel(param);
            expect(mockUibModalInstance.dismiss).toHaveBeenCalled();
            expect(cancel.calls.argsFor(0)).toEqual([param]);
            expect(ok).not.toHaveBeenCalled();

        });
    });

    //not very useful tests just to exercise some branches that were not covered
    describe('confirm - missing parameters', function () {

        var cancel;
        var ok;
        var param;
        var parameter;

        beforeEach(function () {

            param = null;
            cancel = jasmine.createSpy('cancel');
            ok = jasmine.createSpy('ok');
            delete mockScope.parameter;
            controllers.confirmController(mockScope, mockUibModalInstance, null, null, null);
            spyOn(mockUibModalInstance, 'dismiss');
            spyOn(mockUibModalInstance, 'close');

        });

        it('should set not scope fields', function () {

            expect(mockScope.parameter).not.toBeDefined();
            expect(mockScope.applyToAll).toBe(false);

        });

        it('should not call ok', function () {

            mockScope.onOK(param);
            expect(mockUibModalInstance.close).toHaveBeenCalled();
            expect(ok).not.toHaveBeenCalled();

        });

        it('should not call cancel', function () {

            mockScope.onCancel(param);
            expect(mockUibModalInstance.dismiss).toHaveBeenCalled();
            expect(cancel).not.toHaveBeenCalled();

        });
    });
});