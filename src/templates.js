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
  $templateCache.put('diagrams/diagrameditor.html',
    '﻿<div data-ng-controller="diagram as vm" class="container-fluid diagram-container">\n' +
    '    <div ng-show="!vm.errored">\n' +
    '        <div class="col-lg-2">\n' +
    '            <!--Diagram stencil-->\n' +
    '            <uib-accordion close-others="true">\n' +
    '                <div uib-accordion-group is-open="vm.viewStencil">\n' +
    '                    <uib-accordion-heading>\n' +
    '                        Edit diagram <i class="pull-right glyphicon" ng-class="{\'glyphicon-chevron-down\': vm.viewStencil, \'glyphicon-chevron-right\': !vm.viewStencil}"></i>\n' +
    '                    </uib-accordion-heading>\n' +
    '                    <div ng-repeat="stencil in vm.stencils">\n' +
    '                        <div height="120">\n' +
    '                            <tmt-stencil class="stencil" shape="stencil.shape" padding="5" scale="0.9" action="stencil.action()" />\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                </div\n' +
    '                <!--Threat pane-->\n' +
    '                <div uib-accordion-group is-open="vm.viewThreats">\n' +
    '                    <uib-accordion-heading>\n' +
    '                        Edit threats <i class="pull-right glyphicon" ng-class="{\'glyphicon-chevron-down\': vm.viewThreats, \'glyphicon-chevron-right\': !vm.viewThreats}"></i>\n' +
    '                    </uib-accordion-heading>\n' +
    '                    <div ng-if="vm.selected">\n' +
    '                        <div ng-if="!vm.selected.outOfScope">\n' +
    '                            <tmt-element-threats threats="vm.selected.threats" save="vm.edit()" />\n' +
    '                        </div>\n' +
    '                        <div ng-if="vm.selected.outOfScope">\n' +
    '                            <em>The selected element is out of scope</em>\n' +
    '                        </div>                       \n' +
    '                    </div>\n' +
    '                    <div ng-if="!vm.selected">\n' +
    '                        <em>Select an element in the diagram to see or edit its threats</em>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </uib-accordion>\n' +
    '        </div>\n' +
    '        <!--Diagram area-->\n' +
    '        <div class="col-lg-8">\n' +
    '            <div class="panel panel-default">\n' +
    '                <div ng-if="!vm.diagram.title" class="panel-heading panel-title">\n' +
    '                    <span>Loading...</span>\n' +
    '                </div>\n' +
    '                <div ng-if="vm.diagram.title" class="panel-heading panel-title">\n' +
    '                    <span editable-text="vm.diagram.title" onaftersave="vm.save()" e-form="diagramTitleInput" e-required e-placeholder="Diagram title">{{ vm.diagram.title }}</span>\n' +
    '                    <span class="pull-right glyphicon glyphicon-edit" ng-click="diagramTitleInput.$show()" ng-hide="diagramTitleInput.$visible"></span>\n' +
    '                </div>\n' +
    '                <div class="panel-body">\n' +
    '                    <form name="diagramEditToolBar">\n' +
    '                        <div class="col-md-12">\n' +
    '                            <div class="btn-group pull-left" role="group">\n' +
    '                                <a class="btn btn-default" href="#/threatmodel/{{vm.threatModelLocation.organisation}}/{{vm.threatModelLocation.repo}}/{{vm.threatModelLocation.branch}}/{{vm.threatModelLocation.model}}" role="button" data-toggle="tooltip" data-placement="top" title="Cancel Edit">\n' +
    '                                    <span class="glyphicon glyphicon-remove"></span>\n' +
    '                                </a>\n' +
    '                                <button class="btn btn-default" type="button" ng-disabled="vm.currentZoomLevel == vm.maxZoom"  data-toggle="tooltip" ng-click="vm.zoomIn()" data-placement="top" title="Zoom in">\n' +
    '                                    <span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span>\n' +
    '                                </button>\n' +
    '                                <button class="btn btn-default" type="button" ng-disabled="vm.currentZoomLevel == -vm.maxZoom" data-toggle="tooltip" ng-click="vm.zoomOut()" data-placement="top" title="Zoom out">\n' +
    '                                    <span class="glyphicon glyphicon-zoom-out" aria-hidden="true"></span>\n' +
    '                                </button>\n' +
    '                                <button class="btn btn-default" type="button" data-toggle="tooltip" ng-click="vm.clear()" data-placement="top" title="Delete All Elements From This Diagram">\n' +
    '                                    <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>\n' +
    '                                </button>\n' +
    '                                <button class="btn btn-default" ng-disabled="!vm.dirty" type="button" data-toggle="tooltip" ng-click="vm.reload()" data-placement="top" title="Discard Changes And Reopen Diagram">\n' +
    '                                    <span class="fa fa-undo" aria-hidden="true"></span>\n' +
    '                                </button>\n' +
    '                                <button class="btn btn-default" ng-disabled="vm.selected == null || vm.selected.outOfScope" type="button" data-toggle="tooltip" ng-click="vm.generateThreats()" data-placement="top" title="Suggest threats for the selected element">\n' +
    '                                    <span class="glyphicon glyphicon-flash" aria-hidden="true"></span>\n' +
    '                                </button>\n' +
    '                                <button class="btn btn-default" ng-disabled="!vm.dirty" type="button" data-toggle="tooltip" ng-click="vm.save()" data-placement="top" title="Save This Diagram">\n' +
    '                                    <span class="glyphicon glyphicon-save" aria-hidden="true"></span>\n' +
    '                                </button>\n' +
    '                            </div>\n' +
    '                        </div>\n' +
    '                    </form>\n' +
    '                    <div class="tmt-diagram-container">\n' +
    '                        <tmt-diagram graph="vm.graph" select="vm.select(element)" new-flow="vm.newFlow(source, target)" initialise-graph="vm.initialise(diagram)" height="600" width="800" grid-size="1" interactive="true"/>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <!--Element properties-->\n' +
    '        <div class="col-lg-2">\n' +
    '            <div class="panel panel-default">\n' +
    '                <div class="panel-heading panel-title">Properties</div>\n' +
    '                <div class="panel-body">\n' +
    '                    <div ng-if="vm.selected && vm.selected.attributes.type != \'tm.Boundary\' ">\n' +
    '                        <tmt-element-properties edit=" vm.edit()" selected="vm.selected" element-type="{{vm.selected.attributes.type}}">\n' +
    '                    </div>\n' +
    '                    <div ng-if="!vm.selected || vm.selected.attributes.type === \'tm.Boundary\'">\n' +
    '                        <em>Select an element in the diagram to see or edit its properties</em>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <!--Error content-->\n' +
    '    <div ng-show="vm.errored">\n' +
    '        <div class="jumbotron">\n' +
    '            <h1>oooops!</h1>\n' +
    '            <p>\n' +
    '                It looks like you tried to edit a threat model diagram that doesn\'t exist. Maybe you typed the\n' +
    '                address wrong? Or if you clicked a link to get here, the diagram might have been\n' +
    '                deleted since you made the link <span class="fa fa-frown-o"></span>\n' +
    '            </p>\n' +
    '            <p>\n' +
    '                <a href="#">Take me home</a>\n' +
    '            </p>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '')
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

  }]);
