angular.module('templates', [])
  .run(['$templateCache', function($templateCache) {
    $templateCache.put('diagrams/confirmReloadOnDirty.html',
    '﻿<div>\n' +
    '    <div class="modal-header">\n' +
    '        <h3>Are you sure?</h3>\n' +
    '    </div>\n' +
    '    <div class="modal-body">\n' +
    '        Your diagram has unsaved changes and if you reload they will be lost!\n' +
    '        Press Cancel to keep the unsaved changes, or press OK to reload the diagram and lose the unsaved changes.\n' +
    '    </div>\n' +
    '    <div class="modal-footer">\n' +
    '        <button class="btn btn-default" ng-click="onOK()">OK</button>\n' +
    '        <button class="btn btn-primary" ng-click="onCancel()">Cancel</button>\n' +
    '    </div>\n' +
    '</div>\n' +
    '')
  $templateCache.put('diagrams/modalAccept.html',
    '﻿<button class="btn btn-primary" ng-disabled="parameter.editing && (!threatEditForm.$dirty || !threatEditForm.$valid)" ng-click="onAction()">\n' +
    '    Accept\n' +
    '</button>')
  $templateCache.put('diagrams/modalIgnore.html',
    '﻿<button class="btn btn-default" ng-click="onAction()">\n' +
    '    Ignore\n' +
    '</button>')
  $templateCache.put('diagrams/ThreatEditPane.html',
    '﻿<div>\n' +
    '    <div class="modal-header">\n' +
    '        <h3>{{parameter.heading}}</h3>\n' +
    '    </div>\n' +
    '    <div class="modal-body">\n' +
    '        <form name="threatEditForm">\n' +
    '            <div class="form-group">\n' +
    '                <label>Title</label>\n' +
    '                <input name="titleInput" class="form-control" ng-required="true" type="text" ng-model="parameter.threat.title" placeholder="A short title for the threat" />\n' +
    '                <div ng-show="!threatEditForm.titleInput.$valid && threatEditForm.titleInput.$dirty">\n' +
    '                    <p>\n' +
    '                        <div class="alert alert-danger" role="alert">\n' +
    '                            <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>\n' +
    '                            <span class="sr-only">Error:</span>\n' +
    '                            The threat title cannot be empty.\n' +
    '                        </div>\n' +
    '                    </p>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <label>STRIDE threat type</label>\n' +
    '                <select name="typeInput" class="form-control" ng-required="true" ng-model="parameter.threat.type">\n' +
    '                    <option selected>Spoofing</option>\n' +
    '                    <option>Tampering</option>\n' +
    '                    <option>Repudiation</option>\n' +
    '                    <option>Information disclosure</option>\n' +
    '                    <option>Denial of service</option>\n' +
    '                    <option>Elevation of privilege</option>\n' +
    '                </select>\n' +
    '                <div ng-show="!threatEditForm.typeInput.$valid && threatEditForm.typeInput.$dirty">\n' +
    '                    <p>\n' +
    '                        <div class="alert alert-danger" role="alert">\n' +
    '                            <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>\n' +
    '                            <span class="sr-only">Error:</span>\n' +
    '                            The threat type cannot be empty.\n' +
    '                        </div>\n' +
    '                    </p>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="form-group pull-left">\n' +
    '                <label>Threat status</label>\n' +
    '                <div>\n' +
    '                    <div class="btn-group" name="statusInput">\n' +
    '                        <label class="btn btn-primary" name="statusInputOpen" ng-model="parameter.threat.status" uib-btn-radio="\'Open\'">Open</label>\n' +
    '                        <label class="btn btn-primary" name="statusInputMitigated" ng-model="parameter.threat.status" uib-btn-radio="\'Mitigated\'">Mitigated</label>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="form-group pull-right">\n' +
    '                <label>Severity</label>\n' +
    '                <div>\n' +
    '                    <div class="btn-group" required>\n' +
    '                        <label class="btn btn-default" ng-model="parameter.threat.severity" uib-btn-radio="\'High\'">High</label>\n' +
    '                        <label class="btn btn-default" ng-model="parameter.threat.severity" uib-btn-radio="\'Medium\'">Medium</label>\n' +
    '                        <label class="btn btn-default" ng-model="parameter.threat.severity" uib-btn-radio="\'Low\'">Low</label>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="clearfix"></div>\n' +
    '            <div class="form-group">\n' +
    '                <label>Description</label>\n' +
    '                <textarea name="descriptionInput" ng-model="parameter.threat.description" class="form-control" rows="5" placeholder="Detailed description of the threat"></textarea>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <label>Mitigations</label>\n' +
    '                <textarea name="mitigationInput" ng-model="parameter.threat.mitigation" class="form-control" rows="5" placeholder="Mitigations for the threat"></textarea>\n' +
    '            </div>\n' +
    '        </form>\n' +
    '    </div>\n' +
    '    <div ng-if="parameter.editing" class="modal-footer">\n' +
    '        <button class="btn btn-primary" ng-disabled="!threatEditForm.$dirty || !threatEditForm.$valid" ng-click="onOK()">Save</button>\n' +
    '        <button class="btn btn-default" ng-click="onCancel()">Cancel</button>\n' +
    '    </div>\n' +
    '    <div ng-if="!parameter.editing" class="modal-footer">\n' +
    '        <span class="pull-left">\n' +
    '            <input type="checkbox" ng-model="applyToAll">\n' +
    '            Do this for all remaining threats \n' +
    '        </span>\n' +
    '        <tmt-modal-close action="onOK(applyToAll)" new-class="fade-left" template-url="diagrams/modalAccept.html"></tmt-modal-close>\n' +
    '        <tmt-modal-close action="onCancel(applyToAll)" new-class="fade-down" template-url="diagrams/modalIgnore.html"></tmt-modal-close>\n' +
    '    </div>\n' +
    '</div>\n' +
    '')
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
  $templateCache.put('threatmodels/confirmReloadOnDirty.html',
    '﻿<div>\n' +
    '    <div class="modal-header">\n' +
    '        <h3>Are you sure?</h3>\n' +
    '    </div>\n' +
    '    <div class="modal-body">\n' +
    '        Your threat model has unsaved changes and if you reload they will be lost!\n' +
    '        Press Cancel to keep the unsaved changes, or press OK to reload the threat model and lose the unsaved changes.\n' +
    '    </div>\n' +
    '    <div class="modal-footer">\n' +
    '        <button class="btn btn-default" ng-click="onOK()">OK</button>\n' +
    '        <button class="btn btn-primary" ng-click="onCancel()">Cancel</button>\n' +
    '    </div>\n' +
    '</div>\n' +
    '')

  }]);
