angular.module('templates', [])
  .run(['$templateCache', function($templateCache) {
    $templateCache.put('layout/shell.html',
    '﻿<div ng-controller="shell as vm">\n' +
    '    <header ng-if="!vm.suppressBanner" class="clearfix">\n' +
    '        <div ng-include="\'layout/topnav.html\'"></div>\n' +
    '    </header>\n' +
    '    <section id="content">\n' +
    '        <div ng-view></div>\n' +
    '    </section>\n' +
    '</div>\n' +
    '')
  $templateCache.put('layout/structuredExit.html',
    '﻿<div id="structuredExitModal">\n' +
    '    <div class="modal-header">\n' +
    '        <h3>Are you sure you want to leave this page?</h3>\n' +
    '    </div>\n' +
    '    <div class="modal-body">\n' +
    '        You have unsaved changes and if you leave this page they will be lost!\n' +
    '        Press Cancel to stay where you are and keep the unsaved changes,\n' +
    '        or press OK to leave and lose the unsaved changes.\n' +
    '    </div>\n' +
    '    <div class="modal-footer">\n' +
    '        <button id="buttonOK" class="btn btn-default" ng-click="onOK()">OK</button>\n' +
    '        <button id="buttonCancel" class="btn btn-primary" ng-click="onCancel()">Cancel</button>\n' +
    '    </div>\n' +
    '</div>\n' +
    '')
  $templateCache.put('layout/topnav.html',
    '﻿<nav class="navbar navbar-default navbar-fixed-top">\n' +
    '    <div class="container-fluid">\n' +
    '        <div class="navbar-header">\n' +
    '            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse-1">\n' +
    '                <span class="sr-only">Toggle navigation</span>\n' +
    '                <span class="icon-bar"></span>\n' +
    '                <span class="icon-bar"></span>\n' +
    '                <span class="icon-bar"></span>\n' +
    '            </button>\n' +
    '            <a href="#/" class="navbar-brand">\n' +
    '                <div>\n' +
    '                    <img src="public/content/images/threatdragon_logo.svg"/>\n' +
    '                </div>\n' +
    '            </a>\n' +
    '        </div>\n' +
    '\n' +
    '        <!-- Navigation starts -->\n' +
    '        <div class="navbar-collapse collapse" id="navbar-collapse-1">\n' +
    '            <ul class="nav navbar-nav navbar-right">\n' +
    '                <li>\n' +
    '                    <form class="navbar-form" role="logout" method="POST" action="logout">\n' +
    '                        <span ng-include="\'logoutform\'"></span>\n' +
    '                        <button class="btn btn-primary navbar-btn" type="submit">\n' +
    '                            <i class="fa fa-sign-out fa-2x icon-align" title="Sign out"></i> <span> Log out</span>\n' +
    '                        </button>\n' +
    '                        <a class="btn btn-primary navbar-btn" href="http://docs.threatdragon.org/" target="_blank">\n' +
    '                            <i title="Get some help" class="fa fa-question-circle fa-2x"></i>\n' +
    '                        </a>\n' +
    '                        <a class="btn btn-primary navbar-btn" href="https://github.com/mike-goodwin/owasp-threat-dragon" target="_blank">\n' +
    '                            <i title="Visit us on GitHub" class="fa fa-github fa-2x"></i>\n' +
    '                        </a>\n' +
    '                        <a title="Go to the OWASP wiki" class="btn btn-primary navbar-btn" href="https://www.owasp.org" target="_blank">\n' +
    '                            <div>\n' +
    '                                <img src="public/content/images/owasp.svg"/>\n' +
    '                            </div>\n' +
    '                        </a>\n' +
    '                    </form>\n' +
    '                </li>\n' +
    '            </ul>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</nav>\n' +
    '')

  }]);
