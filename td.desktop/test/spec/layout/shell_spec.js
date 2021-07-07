'use strict';

describe('shell controller', function () {

    var $scope;
    var $controller;
    var $location;
    var $httpBackend;
    var $route;
    var $q;
    var mockElectron = {
        Menu: {
            buildFromTemplate: function() { },
            setApplicationMenu: function() { }
        },
        shell: {
            openExternal: function() {}
        },
        dialog: {
            open: function() {},
            messageBox: function() {},
            save: function() {}
        },
        log: {
            error: function() {},
            debug: function() {},
            info: function() {},
            warn: function() {}
        }
    };
    var mockDatacontext = {
        close: function() {},
        update: function() {},
        saveAs: function() {}
    };
    var testMenu = 'test menu';
    var templateMenu;
    var testVersion = 'test version';

    beforeEach(function () {

        spyOn(mockElectron.Menu, 'buildFromTemplate').and.returnValue(testMenu);
        spyOn(mockElectron.Menu, 'setApplicationMenu');
        angular.mock.module('app');
        angular.mock.module(function ($provide) {
            $provide.value('electron', mockElectron);
            $provide.value('datacontext', mockDatacontext);
            $provide.value('VERSION', testVersion);
        });

        angular.mock.inject(function ($rootScope, _$q_, _$controller_, _$httpBackend_, _$location_, _$route_) {
            $scope = $rootScope.$new();
            $q = _$q_;
            $controller = _$controller_;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET().respond();
            $location = _$location_;
            $route = _$route_;
        });

        $controller('shell as vm', { $scope: $scope });
        $scope.$apply();

        templateMenu = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
    });

    it('should be defined', function () {
        expect($scope.vm).toBeDefined();
    });

    it('should set the application menu for the window', function() {
        expect(mockElectron.Menu.buildFromTemplate).toHaveBeenCalled();
        expect(mockElectron.Menu.setApplicationMenu).toHaveBeenCalled();
        expect(mockElectron.Menu.setApplicationMenu.calls.argsFor(0)).toEqual([testMenu]);
    });

    //file:
    it('File menu first item should be create a new model', function() {
        var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
        var subMenu = getSubMenu(template, 'File');
        expect(subMenu.submenu[0].label).toEqual('New');
        expect(subMenu.submenu[0].accelerator).toEqual('CmdOrCtrl+N');
        var click = subMenu.submenu[0].click;
        var testFileName = 'test file name';
        var testFilenames = [testFileName];
        mockElectron.dialog.save = function(onSave, onNoSave) {
            onSave(testFilenames);
        }

        spyOn($scope, '$apply').and.callThrough();
        spyOn($location, 'path').and.callThrough();
        spyOn(mockDatacontext, 'update');
        click();
        expect($location.path.calls.count()).toEqual(1);
        expect($location.path()).toEqual('/threatmodel/' + testFileName);
        expect($scope.$apply).toHaveBeenCalled();
        expect(mockDatacontext.update).toHaveBeenCalled();
    });

    it('File menu first item should be create a new model - cancel', function() {
        var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
        var subMenu = getSubMenu(template, 'File');
        expect(subMenu.submenu[0].label).toEqual('New');
        expect(subMenu.submenu[0].accelerator).toEqual('CmdOrCtrl+N');
        var click = subMenu.submenu[0].click;
        var testFileName = 'test file name';
        var testFilenames = [testFileName];
        mockElectron.dialog.save = function(onSave, onNoSave) {
            onNoSave();
        }

        spyOn($scope, '$apply').and.callThrough();
        spyOn($location, 'path').and.callThrough();
        spyOn(mockDatacontext, 'update');
        click();
        expect($location.path.calls.count()).toEqual(0);
        expect($scope.$apply).not.toHaveBeenCalled();
        expect(mockDatacontext.update).not.toHaveBeenCalled();
    });

    it('File menu second item should be open a model - open a file', function() {
        var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
        var subMenu = getSubMenu(template, 'File');
        expect(subMenu.submenu[1].label).toEqual('Open');
        expect(subMenu.submenu[1].accelerator).toEqual('CmdOrCtrl+O');
        var click = subMenu.submenu[1].click;
        var testFileName = 'test file name';
        var testFilenames = [testFileName];
        mockElectron.dialog.open = function(f) {
            f(testFilenames);
        }

        spyOn($scope, '$apply').and.callThrough();
        spyOn($location, 'path').and.callThrough();
        click();
        expect($location.path.calls.count()).toEqual(2);
        expect($location.path()).toEqual('/threatmodel/' + testFileName);
        expect($scope.$apply).toHaveBeenCalled();
    });

    it('File menu second item should be open a model - reload', function() {
        var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
        var subMenu = getSubMenu(template, 'File');
        expect(subMenu.submenu[1].label).toEqual('Open');
        expect(subMenu.submenu[1].accelerator).toEqual('CmdOrCtrl+O');
        var click = subMenu.submenu[1].click;
        var testFileName = 'test file name';
        var testFilenames = [testFileName];
        mockElectron.dialog.open = function(f) {
            f(testFilenames);
        }

        spyOn($scope, '$apply').and.callThrough();
        spyOn($location, 'path').and.returnValue('/threatmodel/' + testFileName);
        spyOn($route, 'reload').and.callThrough();
        click();
        expect($location.path.calls.count()).toEqual(1);
        expect($scope.$apply).toHaveBeenCalled();
        expect($route.reload).toHaveBeenCalled();
    });

    it('File menu second item should be open a model - cancel', function() {
        var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
        var subMenu = getSubMenu(template, 'File');
        expect(subMenu.submenu[1].label).toEqual('Open');
        expect(subMenu.submenu[1].accelerator).toEqual('CmdOrCtrl+O');
        var click = subMenu.submenu[1].click;
        var testFileName = 'test file name';
        var testFilenames = [testFileName];
        var testLocation = 'test location';
        mockDatacontext.threatModelLocation = testLocation;
        mockElectron.dialog.open = function(f, g) {
            g(testFilenames);
        }

        spyOn($scope, '$apply').and.callThrough();
        spyOn($location, 'path').and.returnValue('/threatmodel/file');
        click();
        expect($location.path).not.toHaveBeenCalled();
        expect($scope.$apply).not.toHaveBeenCalled();
        expect(mockDatacontext.threatModelLocation).toEqual(testLocation);
    });

    it('File menu third item should open the demo model', function() {
        var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
        var subMenu = getSubMenu(template, 'File');
        expect(subMenu.submenu[2].label).toEqual('Open Demo Model');
        expect(subMenu.submenu[2].accelerator).toEqual('CmdOrCtrl+D');
        var click = subMenu.submenu[2].click;

        spyOn($scope, '$apply').and.callThrough();
        click();
        expect($location.path()).toEqual('/threatmodel/demo');
        expect($scope.$apply).toHaveBeenCalled();
    });

    it('File menu fourth item should save the model (datacontext)', function() {
        var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
        var subMenu = getSubMenu(template, 'File');
        expect(subMenu.submenu[3].label).toEqual('Save');
        expect(subMenu.submenu[3].accelerator).toEqual('CmdOrCtrl+S');
        var click = subMenu.submenu[3].click;
        spyOn(mockDatacontext, 'update');
        click();
        expect(mockDatacontext.update).toHaveBeenCalled();
    });

    describe('fix for #43: https://github.com/mike-goodwin/owasp-threat-dragon-desktop/issues/43', function() {

        beforeEach(function() {

            $scope.vm.saveDiagram = function() {};
            spyOn($scope.vm, 'saveDiagram');

        });

        afterEach(function() {

            if ($scope.vm.saveDiagram) {
                delete $scope.vm.saveDiagram;
            }

        });
        
        it('File menu fourth item should save the model (view model)', function() {
            var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
            var subMenu = getSubMenu(template, 'File');
            expect(subMenu.submenu[3].label).toEqual('Save');
            expect(subMenu.submenu[3].accelerator).toEqual('CmdOrCtrl+S');
            var click = subMenu.submenu[3].click;
            spyOn(mockDatacontext, 'update');
            spyOn($location, 'path').and.returnValue('/threatmodel/modelname/diagram/diagramid');
            click();
            expect(mockDatacontext.update).not.toHaveBeenCalled();
            expect($scope.vm.saveDiagram).toHaveBeenCalled();
        });

        it('File menu fourth item should save the model (datacontext - not a diagram path)', function() {
            var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
            var subMenu = getSubMenu(template, 'File');
            expect(subMenu.submenu[3].label).toEqual('Save');
            expect(subMenu.submenu[3].accelerator).toEqual('CmdOrCtrl+S');
            var click = subMenu.submenu[3].click;
            spyOn(mockDatacontext, 'update');
            spyOn($location, 'path').and.returnValue('/threatmodel/modelname/notdiag/diagramid');
            click();
            expect(mockDatacontext.update).toHaveBeenCalled();
            expect($scope.vm.saveDiagram).not.toHaveBeenCalled();
        });

        it('File menu fourth item should save the model (datacontext - not a threatmodel path)', function() {
            var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
            var subMenu = getSubMenu(template, 'File');
            expect(subMenu.submenu[3].label).toEqual('Save');
            expect(subMenu.submenu[3].accelerator).toEqual('CmdOrCtrl+S');
            var click = subMenu.submenu[3].click;
            spyOn(mockDatacontext, 'update');
            spyOn($location, 'path').and.returnValue('/notmodel/modelname/diagram/diagramid');
            click();
            expect(mockDatacontext.update).toHaveBeenCalled();
            expect($scope.vm.saveDiagram).not.toHaveBeenCalled();
        });

        it('File menu fourth item should save the model (datacontext - no vm method available)', function() {
            var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
            var subMenu = getSubMenu(template, 'File');
            expect(subMenu.submenu[3].label).toEqual('Save');
            expect(subMenu.submenu[3].accelerator).toEqual('CmdOrCtrl+S');
            var click = subMenu.submenu[3].click;
            spyOn(mockDatacontext, 'update');
            delete $scope.vm.saveDiagram;
            spyOn($location, 'path').and.returnValue('/threatmodel/modelname/diagram/diagramid');
            click();
            expect(mockDatacontext.update).toHaveBeenCalled();
        });
    });

    it('File menu fifth item should be save as', function() {
        var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
        var subMenu = getSubMenu(template, 'File');
        expect(subMenu.submenu[4].label).toEqual('Save As');
        var click = subMenu.submenu[4].click;
        spyOn(mockDatacontext, 'saveAs').and.returnValue($q.when(null));
        click();
        expect(mockDatacontext.saveAs).toHaveBeenCalled();
    });

    it('File menu sixth item should be close model', function() {
        var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
        var subMenu = getSubMenu(template, 'File');
        expect(subMenu.submenu[5].label).toEqual('Close Model');
        if (process.platform === 'darwin') {
            expect(subMenu.submenu[5].accelerator).toEqual('CmdOrCtrl+W');
        } else {
            expect(subMenu.submenu[5].accelerator).toEqual('CmdOrCtrl+F4');
        }
        var click = subMenu.submenu[5].click;

        spyOn($scope, '$apply').and.callThrough();
        spyOn(mockDatacontext, 'close');
        click();
        expect($location.path()).toEqual('/');
        expect($scope.$apply).toHaveBeenCalled();
        expect(mockDatacontext.close).toHaveBeenCalled();
    });

    it('File menu seventh item should toggle developer tools', function() {
        var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
        var subMenu = getSubMenu(template, 'File');
        expect(subMenu.submenu[6].label).toEqual('Toggle Developer Tools');
        expect(subMenu.submenu[6].accelerator).toEqual('Ctrl+Shift+I');

        var click = subMenu.submenu[6].click;
        var mockWindow = {
            webContents: {
                toggleDevTools: function() {}
            }
        };

        var toggleSpy = spyOn(mockWindow.webContents, 'toggleDevTools');
        click(null, mockWindow);
        expect(toggleSpy).toHaveBeenCalled();
        //fairly pointless test since the window will never be null in normal cases
        //but gets the branch coverage up
        toggleSpy.calls.reset();
        click(null, null);
        expect(toggleSpy).not.toHaveBeenCalled();

    });

    it('File menu eighth item should be a separator', function() {
        var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
        var subMenu = getSubMenu(template, 'File');
        expect(subMenu.submenu[7].type).toEqual('separator');
    });

    it('File menu ninth item should be exit', function() {
        var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
        var subMenu = getSubMenu(template, 'File');
        if (process.platform === 'darwin') {
            expect(subMenu.submenu[8].label).toEqual('Quit');
            expect(subMenu.submenu[8].accelerator).toEqual('CmdOrCtrl+Q');
        } else {
            expect(subMenu.submenu[8].label).toEqual('Exit');
            expect(subMenu.submenu[8].accelerator).toEqual('CmdOrCtrl+W');
        }
        expect(subMenu.submenu[8].role).toEqual('close');
    });

    //Edit:
    it('Edit menu first item should be Undo', function() {
        var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
        var subMenu = getSubMenu(template, 'Edit');
        expect(subMenu.submenu[0].label).toEqual('Undo');
        expect(subMenu.submenu[0].accelerator).toEqual('CmdOrCtrl+Z');
        expect(subMenu.submenu[0].selector).toEqual('undo:');
    });

    it('Edit menu second item should be Redo', function() {
        var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
        var subMenu = getSubMenu(template, 'Edit');
        expect(subMenu.submenu[1].label).toEqual('Redo');
        expect(subMenu.submenu[1].accelerator).toEqual('Shift+CmdOrCtrl+Z');
        expect(subMenu.submenu[1].selector).toEqual('redo:');
    });

    it('Edit menu third item should be a separator', function() {
        var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
        var subMenu = getSubMenu(template, 'Edit');
        expect(subMenu.submenu[2].type).toEqual('separator');
    });

    it('Edit menu fourth item should be Cut', function() {
        var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
        var subMenu = getSubMenu(template, 'Edit');
        expect(subMenu.submenu[3].label).toEqual('Cut');
        expect(subMenu.submenu[3].accelerator).toEqual('CmdOrCtrl+X');
        expect(subMenu.submenu[3].selector).toEqual('cut:');
    });

    it('Edit menu fifth item should be Copy', function() {
        var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
        var subMenu = getSubMenu(template, 'Edit');
        expect(subMenu.submenu[4].label).toEqual('Copy');
        expect(subMenu.submenu[4].accelerator).toEqual('CmdOrCtrl+C');
        expect(subMenu.submenu[4].selector).toEqual('copy:');
    });

    it('Edit menu sixth item should be Paste', function() {
        var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
        var subMenu = getSubMenu(template, 'Edit');
        expect(subMenu.submenu[5].label).toEqual('Paste');
        expect(subMenu.submenu[5].accelerator).toEqual('CmdOrCtrl+V');
        expect(subMenu.submenu[5].selector).toEqual('paste:');
    });

    it('Edit menu seventh item should be Select All', function() {
        var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
        var subMenu = getSubMenu(template, 'Edit');
        expect(subMenu.submenu[6].label).toEqual('Select All');
        expect(subMenu.submenu[6].accelerator).toEqual('CmdOrCtrl+A');
        expect(subMenu.submenu[6].selector).toEqual('selectAll:');
    });

    //view:
    it('View menu first item should be Reload', function() {
        var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
        var subMenu = getSubMenu(template, 'View');
        expect(subMenu.submenu[0].label).toEqual('Reload');
        expect(subMenu.submenu[0].accelerator).toEqual('CmdOrCtrl+R');

        var click = subMenu.submenu[0].click;
        var mockWindow = {
            reload: function() {}
        };
        var reloadSpy = spyOn(mockWindow, 'reload');
        click(null, mockWindow);
        expect(reloadSpy).toHaveBeenCalled();
        //fairly pointless test since the window will never be null in normal cases
        //but gets the branch coverage up
        reloadSpy.calls.reset();
        click(null, null);
        expect(reloadSpy).not.toHaveBeenCalled();

    });

    it('View menu second item should be a separator', function() {
        var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
        var subMenu = getSubMenu(template, 'View');
        expect(subMenu.submenu[1].type).toEqual('separator');
    });

    it('View menu third item should be reset zoom', function() {
        var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
        var subMenu = getSubMenu(template, 'View');
        expect(subMenu.submenu[2].role).toEqual('resetzoom');
        expect(subMenu.submenu[2].accelerator).toEqual('CmdOrCtrl+0');
    });

    it('View menu fourth item should be zoomin', function() {
        var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
        var subMenu = getSubMenu(template, 'View');
        expect(subMenu.submenu[3].role).toEqual('zoomin');
        expect(subMenu.submenu[3].accelerator).toEqual('CmdOrCtrl+=');
    });

    it('View menu fifth item should be zoomout', function() {
        var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
        var subMenu = getSubMenu(template, 'View');
        expect(subMenu.submenu[4].role).toEqual('zoomout');
        expect(subMenu.submenu[4].accelerator).toEqual('CmdOrCtrl+-');
    });

    it('View menu sixth item should be a separator', function() {
        if (process.platform === 'win32') {
            var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
            var subMenu = getSubMenu(template, 'View');
            expect(subMenu.submenu[5].type).toEqual('separator');
        }
    });

    it('View menu seventh item should toggle full screen', function() {
        if (process.platform === 'win32') {
            var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
            var subMenu = getSubMenu(template, 'View');
            expect(subMenu.submenu[6].role).toEqual('togglefullscreen');
            expect(subMenu.submenu[6].accelerator).toEqual('CmdOrCtrl+F11');
        }
    });

    //window:
    it('Window menu first item should be minimize', function() {
        var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
        var subMenu = getSubMenu(template, 'Window');
        expect(subMenu.submenu[0].role).toEqual('minimize');
    });

    it('Window menu second item should be close', function() {
        var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
        var subMenu = getSubMenu(template, 'Window');
        expect(subMenu.submenu[1].role).toEqual('close');
    });

    //Help:
    it('Help menu item should browse to the documentation page', function() {
        var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
        var subMenu = getSubMenu(template, 'Help');
        expect(subMenu.submenu[0].label).toEqual('Documentation');
        spyOn(mockElectron.shell, 'openExternal');
        subMenu.submenu[0].click();
        expect(mockElectron.shell.openExternal.calls.argsFor(0)).toEqual(['https://threatdragon.github.io/']);      
    });

    it('Help menu item should browse to the OWASP project page', function() {
        var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
        var subMenu = getSubMenu(template, 'Help');
        expect(subMenu.submenu[1].label).toEqual('Visit us at OWASP');
        spyOn(mockElectron.shell, 'openExternal');
        subMenu.submenu[1].click();
        expect(mockElectron.shell.openExternal.calls.argsFor(0)).toEqual(['https://owasp.org/www-project-threat-dragon/']); 
    });

    it('Help menu item should browse to the OWASP cheat sheets', function() {
        var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
        var subMenu = getSubMenu(template, 'Help');
        expect(subMenu.submenu[2].label).toEqual('OWASP Cheat Sheets');
        spyOn(mockElectron.shell, 'openExternal');
        subMenu.submenu[2].click();
        expect(mockElectron.shell.openExternal.calls.argsFor(0)).toEqual(['https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html']); 
    });

    it('Help menu fourth item should be a separator', function() {
        var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
        var subMenu = getSubMenu(template, 'Help');
        expect(subMenu.submenu[3].type).toEqual('separator');
    });

    it('Help menu item should browse to the GitHub repo page', function() {
        var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
        var subMenu = getSubMenu(template, 'Help');
        expect(subMenu.submenu[4].label).toEqual('Visit us on GitHub');
        spyOn(mockElectron.shell, 'openExternal');
        subMenu.submenu[4].click();
        expect(mockElectron.shell.openExternal.calls.argsFor(0)).toEqual(['https://github.com/owasp/threat-dragon-desktop/']); 
    });

    it('Help menu item should browse to the GitHub issues page', function() {
        var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
        var subMenu = getSubMenu(template, 'Help');
        expect(subMenu.submenu[5].label).toEqual('Submit an Issue');
        spyOn(mockElectron.shell, 'openExternal');
        subMenu.submenu[5].click();
        expect(mockElectron.shell.openExternal.calls.argsFor(0)).toEqual(['https://github.com/owasp/threat-dragon-desktop/issues/new/choose/']); 
    });

    it('Help menu item should browse to check for updates', function() {
        var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
        var subMenu = getSubMenu(template, 'Help');
        expect(subMenu.submenu[6].label).toEqual('Check for updates ...');
        spyOn(mockElectron.shell, 'openExternal');
        subMenu.submenu[6].click();
        expect(mockElectron.shell.openExternal.calls.argsFor(0)).toEqual(['https://github.com/OWASP/threat-dragon-desktop/releases/']); 
    });

    it('Help menu seventh item should be a separator', function() {
        var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
        var subMenu = getSubMenu(template, 'Help');
        expect(subMenu.submenu[7].type).toEqual('separator');
    });

    it('Help menu item should show a help about', function() {
        var template = mockElectron.Menu.buildFromTemplate.calls.argsFor(0)[0];
        var subMenu = getSubMenu(template, 'Help');
        expect(subMenu.submenu[8].label).toEqual('About');
        spyOn(mockElectron.dialog, 'messageBox');
        subMenu.submenu[8].click();
        expect(mockElectron.dialog.messageBox).toHaveBeenCalled();
    });

    function getSubMenu(template, label) {

        return template.find( function(item) {
            return item.label == label;
        });
    };
});
