angular.module('templates', [])
  .run(['$templateCache', function($templateCache) {
    $templateCache.put('diagrams/ElementPropertiesPane.html',
    '﻿<form name="elementPropertiesEditForm">\n' +
    '    <div>\n' +
    '        <div class="form-group">\n' +
    '            <label>Name</label>\n' +
    '            <input name="nameInput" class="form-control" type="text" ng-model="selected.name" ng-change="edit()" placeholder="Element name" />\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="checkbox">\n' +
    '        <label>\n' +
    '            <input name="checkboxOutOfScope" type="checkbox" ng-model="selected.outOfScope" ng-change="edit()" /> Out of scope\n' +
    '        </label>\n' +
    '    </div>\n' +
    '    <div class="form-group">\n' +
    '        <label>Reason for out of scope</label>\n' +
    '        <textarea name="textareaReasonOutOfScope" ng-disabled="!selected.outOfScope" rows="4" class="form-control" type="text" ng-model="selected.reasonOutOfScope" ng-change="edit()" placeholder="Reason for out of scope"></textarea>\n' +
    '    </div>\n' +
    '    <div ng-show="elementType === \'tm.Process\'">\n' +
    '        <div class="form-group">\n' +
    '            <label>Privilege level</label>\n' +
    '            <input name="privilegeLevelInput" ng-disabled="selected.outOfScope" class="form-control" type="text" ng-model="selected.privilegeLevel" ng-change="edit()" placeholder="Privilege level" />\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div ng-show="elementType === \'tm.Actor\'">\n' +
    '        <div class="checkbox">\n' +
    '            <label>\n' +
    '                <input name="checkboxProvidesAuthentication" ng-disabled="selected.outOfScope" type="checkbox" ng-model="selected.providesAuthentication" ng-change="edit()" /> Provides authentication\n' +
    '            </label>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div ng-show="elementType === \'tm.Store\'">\n' +
    '        <div class="checkbox">\n' +
    '            <label>\n' +
    '                <input name="checkboxIsALog" ng-disabled="selected.outOfScope" type="checkbox" ng-model="selected.isALog" ng-change="edit()" /> Is a log\n' +
    '            </label>\n' +
    '        </div>\n' +
    '        <div class="checkbox">\n' +
    '            <label>\n' +
    '                <input name="checkboxStoresCredentials" ng-disabled="selected.outOfScope" type="checkbox" ng-model="selected.storesCredentials" ng-change="edit()" /> Stores credentials\n' +
    '            </label>\n' +
    '        </div>\n' +
    '        <div class="checkbox">\n' +
    '            <label>\n' +
    '                <input name="checkboxIsEncryptedStore" ng-disabled="selected.outOfScope" type="checkbox" ng-model="selected.isEncrypted" ng-change="edit()" /> Is encrypted\n' +
    '            </label>\n' +
    '        </div>\n' +
    '        <div class="checkbox">\n' +
    '            <label>\n' +
    '                <input name="checkboxIsSigned" ng-disabled="selected.outOfScope" type="checkbox" ng-model="selected.isSigned" ng-change="edit()" /> Is signed\n' +
    '            </label>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div ng-show="elementType === \'tm.Flow\'">\n' +
    '        <div class="form-group">\n' +
    '            <label>Protocol</label>\n' +
    '            <input name="inputProtocol" ng-disabled="selected.outOfScope" class="form-control" type="text" ng-model="selected.protocol" ng-change="edit()" placeholder="Protocol" />\n' +
    '        </div>\n' +
    '        <div class="checkbox">\n' +
    '            <label>\n' +
    '                <input name="checkboxIsEncryptedFlow" ng-disabled="selected.outOfScope" type="checkbox" ng-model="selected.isEncrypted" ng-change="edit()" /> Is encrypted\n' +
    '            </label>\n' +
    '        </div>\n' +
    '        <div class="checkbox">\n' +
    '            <label>\n' +
    '                <input name="checkboxIsPublicNetwork" ng-disabled="selected.outOfScope" type="checkbox" ng-model="selected.isPublicNetwork" ng-change="edit()" /> Is over a public network\n' +
    '            </label>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</form>\n' +
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
  $templateCache.put('diagrams/ThreatSummaryPane.html',
    '﻿<ul id="threatSummaryPane" class="list-group">\n' +
    '    <li class="list-group-item" ng-repeat="threat in threats">\n' +
    '        <a id="editThreat{{$index}}" href="" ng-click="onEditThreat($index)" data-toggle="tooltip" data-placement="top" title="Edit {{threat.title}}">\n' +
    '            <div class="text-overflow"><small>{{threat.title}}</small></div>\n' +
    '        </a>\n' +
    '        <div>\n' +
    '            <small>{{threat.type}}</small>\n' +
    '        </div>\n' +
    '        <div>\n' +
    '            <span ng-class="{Open:\'severity-high fa fa-exclamation-triangle\', Mitigated:\'severity-low fa fa-check\'}[threat.status]" data-toggle="tooltip" data-placement="top" title="{{threat.status}}"></span>\n' +
    '            <span ng-class="{Low:\'fa fa-circle severity-low\', Medium:\'fa fa-circle severity-medium\', High:\'fa fa-circle severity-high\'}[threat.severity]" data-toggle="tooltip" data-placement="top" title="{{threat.severity}}"></span>\n' +
    '            <span id="remove{{$index}}" class="pull-right glyphicon glyphicon-remove severity-high" ng-click="removeThreat($index)" data-toggle="tooltip" data-placement="top" title="Remove this threat"></span>\n' +
    '        </div>\n' +
    '    </li>\n' +
    '</ul> \n' +
    '<button id="buttonNewThreat" class="btn btn-link" ng-click="onNewThreat()">\n' +
    '    <span class="glyphicon glyphicon-plus"></span> Add a new threat...\n' +
    '</button>')

  }]);
