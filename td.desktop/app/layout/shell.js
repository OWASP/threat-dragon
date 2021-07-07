'use strict';

function shell($rootScope, $scope, $location, $route, common, datacontext, electron, threatmodellocator, VERSION) {

    const log = electron.log;
    log.debug('Shell loaded with verbosity level', electron.logLevel);

    var controllerId = 'shell';
    var logSuccess = common.logger.getLogFn(controllerId, 'success');
    var logError = common.logger.getLogFn(controllerId, 'error');

    menuConfigurator();

    $scope.$on('$viewContentLoaded', function () {
        log.debug('Shell -> appLoaded at location.url', $location.url());
        $rootScope.appLoaded = true;
    });

    activate();

    function activate() {
        logSuccess('Threat Dragon loaded!', null, true);
        log.info('Threat Dragon loaded');
        log.debug('Shell -> activate at location.url', $location.url());
        common.activateController([], controllerId);
    }

    function menuConfigurator() {
        log.debug('Shell -> menuConfigurator');
        var template = [
            {
                label: 'File',
                submenu: [
                    {
                        label: 'New',
                        accelerator: 'CmdOrCtrl+N',
                        click: function() {
                            datacontext.threatModel = { summary: { title: "New Threat Model" }, detail: { contributors: [], diagrams: [] } };
                            electron.dialog.save(function (fileName) {
                                datacontext.threatModelLocation = fileName;
                                datacontext.update();
                                var path = threatmodellocator.getModelPath( fileName );
                                $location.path('/threatmodel/' + path);
                                $scope.$apply();
                            },
                                function () { });
                        }
                    },
                    {
                        label: 'Open',
                        accelerator: 'CmdOrCtrl+O',
                        click: function() {
                            electron.dialog.open(function (fileNames) {
                                var path = threatmodellocator.getModelPath( fileNames[0]);
                                if ($location.path() == '/threatmodel/' + path) {
                                    $route.reload();
                                } else {
                                    $location.path('/threatmodel/' + path);
                                }
                                $scope.$apply();
                            },
                                function () { });
                        }
                    },
                    {
                        label: 'Open Demo Model',
                        accelerator: 'CmdOrCtrl+D',
                        click: function() {
                            $location.path('/threatmodel/demo');
                            $scope.$apply();
                        }
                    },
                    {
                        label: 'Save',
                        accelerator: 'CmdOrCtrl+S',
                        click() {
                            //fix for issue #43: https://github.com/mike-goodwin/owasp-threat-dragon-desktop/issues/43
                            //feels like a hack - it involves copying data to the (grand)parent scope
                            //can't think of another way to fix this now though - revisit later
                            if ($location.path().includes('/threatmodel/') && $location.path().includes('/diagram/') && $scope.vm.saveDiagram) {
                                $scope.vm.saveDiagram();
                            } else {
                                datacontext.update();
                            }
                        }
                    },
                    {
                        label: 'Save As',
                        click: function() {
                            datacontext.saveAs().then(onSaveAs, onSaveError);

                            function onSaveAs(result) {
                            }

                            function onSaveError(error) {
                                logError(error);
                                log.error(error);
                            }
                        }
                    },
                    {
                        label: 'Close Model',
                        accelerator: process.platform === 'darwin' ? 'CmdOrCtrl+W' : 'CmdOrCtrl+F4',
                        click: function() {
                            datacontext.close();
                            $location.path('/');
                            $scope.$apply();
                        }
                    },
                    {
                        label: 'Toggle Developer Tools',
                        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                        click: function(item, focusedWindow) {
                            if (focusedWindow) {
                                focusedWindow.webContents.toggleDevTools();
                            }
                        }
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: process.platform === 'darwin' ? 'Quit' : 'Exit',
                        accelerator: process.platform === 'darwin' ? 'CmdOrCtrl+Q' : 'CmdOrCtrl+W',
                        role: process.platform === 'darwin' ? 'quit' : 'close'
                    }
                ]
            },
            {
                label: "Edit",
                submenu: [
                    {
                        label: "Undo",
                        accelerator: "CmdOrCtrl+Z",
                        selector: "undo:"
                    },
                    {
                        label: "Redo",
                        accelerator: "Shift+CmdOrCtrl+Z",
                        selector: "redo:"
                    },
                    {
                        type: "separator"
                    },
                    {
                        label: "Cut",
                        accelerator: "CmdOrCtrl+X",
                        selector: "cut:"
                    },
                    {
                        label: "Copy",
                        accelerator: "CmdOrCtrl+C",
                        selector: "copy:"
                    },
                    {
                        label: "Paste",
                        accelerator: "CmdOrCtrl+V",
                        selector: "paste:"
                    },
                    {
                        label: "Select All",
                        accelerator: "CmdOrCtrl+A",
                        selector: "selectAll:"
                    }
                ]
            },
            {
                label: 'View',
                submenu: [
                    {
                        label: 'Reload',
                        accelerator: 'CmdOrCtrl+R',
                        click: function(item, focusedWindow) {
                            if (focusedWindow) focusedWindow.reload();
                        }
                    },
                    {
                        type: 'separator'
                    },
                    {
                        accelerator: 'CmdOrCtrl+0',
                        role: 'resetzoom'
                    },
                    {
                        accelerator: 'CmdOrCtrl+=',
                        role: 'zoomin'
                    },
                    {
                        accelerator: 'CmdOrCtrl+-',
                        role: 'zoomout'
                    }
                ]
            },
            {
                label: 'Window',
                submenu: [
                    {
                        role: 'minimize'
                    },
                    {
                        role: 'close'
                    }
                ]
            },
            {
                label: 'Help',
                submenu: [
                    {
                        label: 'Documentation',
                        click: function() {
                            electron.shell.openExternal('https://threatdragon.github.io/');
                        }
                    },
                    {
                        label: 'Visit us at OWASP',
                        click: function() {
                            electron.shell.openExternal('https://owasp.org/www-project-threat-dragon/');
                        }
                    },
                    {
                        label: 'OWASP Cheat Sheets',
                        click: function() {
                            electron.shell.openExternal('https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html');
                        }
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Visit us on GitHub',
                        click: function() {
                            electron.shell.openExternal('https://github.com/owasp/threat-dragon-desktop/');
                        }
                    },
                    {
                        label: 'Submit an Issue',
                        click: function() {
                            electron.shell.openExternal('https://github.com/owasp/threat-dragon-desktop/issues/new/choose/');
                        }
                    },
                    {
                        label: 'Check for updates ...',
                        click: function() {
                            electron.shell.openExternal('https://github.com/OWASP/threat-dragon-desktop/releases/');
                        }
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'About',
                        click: function() {
                            electron.dialog.messageBox({
                                type: 'info',
                                buttons: ['OK'],
                                title: 'About OWASP Threat Dragon',
                                message: 'OWASP Threat Dragon is a free, open-source, cross-platform threat modeling application including system diagramming and a rule engine to auto-generate threats/mitigations. It is an OWASP Incubator Project. (Version ' + VERSION + ')'
                            });
                        }
                    }

                ]
            }
        ];

        // layout specific items
        if (process.platform === 'win32') {
            template[2].submenu.push(
                {
                    type: 'separator'
                },
                {
                    accelerator: 'CmdOrCtrl+F11',
                    role: 'togglefullscreen'
                }
            );
        }

        const menu = electron.Menu.buildFromTemplate(template);
        electron.Menu.setApplicationMenu(menu);
    }
}

module.exports = shell;
