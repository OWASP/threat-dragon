'use strict'

var $ = require('jquery');
var joint = require('jointjs');
require('jasmine-jquery');
require('../../src/diagrams/joint.shapes.tm');

describe('custom shape tests', function() {
	
	var graph;
	var diagram;
	var diagramElement;
	var isIE;
	var isFirefox;
	var translateSeperator;
	
	beforeEach(function() {
		
		setFixtures(sandbox({ id: 'diagramElement' }));
		diagramElement = $('#diagramElement');
		graph = new joint.dia.Graph();
		diagram = new joint.dia.Paper({
			el: $(diagramElement),
			width: 600,
			height: 400,
			gridSize: 10,
			model: graph
		});
		
		isIE = false;

		if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
			isIE = true;
		}
		
		isFirefox = false;
		
		if (navigator.userAgent.indexOf('Firefox') !== -1) {
			isFirefox = true;
		}
		 
		//IE represents translate tranform differently - uses a space to seperate co-ords instead of a comma
		translateSeperator = isIE? ' ' : ',';
		
	});
    
    describe(' :process', function() {
        
        var cell;
        var x;
        var y;
        
        beforeEach(function() {
            
            var label = 'new process';
            x = 50;
            y = 60;
            cell = new joint.shapes.tm.Process({
                position: {x: x, y: y},
                attr: {text: {text: label}}
            });
            
            graph.addCell(cell);
            
        });
        
        it('should place a process element', function(){
            
            var selector = 'g[model-id="' + cell.id + '"]';
            expect(diagramElement).toContainElement(selector);            
        });
        
        it('should set the process properties', function() {
            
            var testPrivilegeLevel = 'testPrivilegeLevel';
            cell.privilegeLevel = testPrivilegeLevel;
            expect(cell.privilegeLevel).toEqual(testPrivilegeLevel);
            
            var testReason = 'testReason';
            cell.reasonOutOfScope = testReason;
            expect(cell.reasonOutOfScope).toEqual(testReason);
            
        });
        
        it('should set the out-of-scope class on the process', function() {

            cell.outOfScope = true;
            expect(cell.outOfScope).toBe(true);
            expect(diagramElement).toContainElement('circle.element-shape.isOutOfScope');
            cell.outOfScope = false; 
            expect(cell.outOfScope).toBe(false);    
            expect(diagramElement).not.toContainElement('circle.element-shape.isOutOfScope');             
        });
        
        it('should set the has open threats class on the process', function() {

            cell.hasOpenThreats = true;
            expect(cell.hasOpenThreats).toBe(true);
            expect(diagramElement).toContainElement('circle.element-shape.hasOpenThreats');
            cell.hasOpenThreats = false; 
            expect(cell.hasOpenThreats).toBe(false);    
            expect(diagramElement).not.toContainElement('circle.element-shape.hasOpenThreats');             
        });
        
        it('should highlight a cell', function() {
            
            var cellView = diagram.findViewByModel(cell);
            //jasmine-jquery hasClass matcher does not work - is it because is SVG?
            var selector = 'g[model-id="' + cell.id + '"]';
            expect($(diagramElement).find(selector).attr('class').indexOf('highlighted') >= 0).toBe(false);
            cellView.setSelected();
            expect($(diagramElement).find(selector).attr('class').indexOf('highlighted') >= 0).toBe(true);
        });
        
        it('should unhighlight a cell', function() {
            
            var cellView = diagram.findViewByModel(cell);
            cellView.setSelected();
            //jasmine-jquery hasClass matcher does not work - is it because is SVG?
            var selector = 'g[model-id="' + cell.id + '"]';
            cellView.setSelected();
            expect($(diagramElement).find(selector).attr('class').indexOf('highlighted') >= 0).toBe(true);
            cellView.setUnselected();
            expect($(diagramElement).find(selector).attr('class').indexOf('highlighted') >= 0).toBe(false);

        });
        
        it('should remove an element', function() {
            
            var removeTool = diagramElement.find('.element-tool-remove').children('circle');
            expect(graph.getElements().length).toEqual(1)
            
            //polyfill for firefox - avoids error in JointJS when clientX/Y is undefined
            if (isFirefox) {
                var event = new MouseEvent('click', {clientX: 0, clientY: 0, bubbles: true})
                removeTool[0].dispatchEvent(event);		
            } else {
                removeTool.click();				
            }
            
            expect(graph.getElements().length).toEqual(0)
        });
        
        it('should fire a linkFrom event', function() {
            
            var handlers = {onClick: function() {}};	
            spyOn(handlers, 'onClick');
            diagram.on('cell:pointerclick', handlers.onClick);
            
            var removeTool = diagramElement.find('.element-tool-link').children('circle');
            expect(handlers.onClick).not.toHaveBeenCalled();
            
            //polyfill for firefox - avoids error in JointJS when clientX/Y is undefined
            if (isFirefox) {
                var event = new MouseEvent('click', {clientX: 0, clientY: 0, bubbles: true})
                removeTool[0].dispatchEvent(event);		
            } else {
                removeTool.click();				
            }
            
            expect(handlers.onClick).toHaveBeenCalled();
            expect(handlers.onClick.calls.argsFor(0)[0]._action).toEqual('linkFrom');
        });
        
        it('should fire a removeLinkFrom event', function() {

            var handlers = {onClick: function() {}};	
            spyOn(handlers, 'onClick');
            diagram.on('cell:pointerclick', handlers.onClick);
            
            //jquery addClass does not work - maybe because it is SVG
            diagramElement.find('.element-tool-link').attr('class', 'element-tool-link linking');
            var removeTool = diagramElement.find('.element-tool-link').children('circle');
            expect(handlers.onClick).not.toHaveBeenCalled();
            
            //polyfill for firefox - avoids error in JointJS when clientX/Y is undefined
            if (isFirefox) {
                var event = new MouseEvent('click', {clientX: 0, clientY: 0, bubbles: true})
                removeTool[0].dispatchEvent(event);		
            } else {
                removeTool.click();				
            }
            
            expect(handlers.onClick).toHaveBeenCalled();
            expect(handlers.onClick.calls.argsFor(0)[0]._action).toEqual('removeLinkFrom');
        });
        
        it('should fire an event with no action', function() {

            var handlers = {onClick: function() {}};	
            spyOn(handlers, 'onClick');
            diagram.on('cell:pointerclick', handlers.onClick);
            
            var selector = 'g[model-id="' + cell.id + '"]';
            var nonToolElement = diagramElement.find(selector);
            expect(handlers.onClick).not.toHaveBeenCalled();
            
            //polyfill for firefox - avoids error in JointJS when clientX/Y is undefined
            if (isFirefox) {
                var event = new MouseEvent('click', {clientX: 0, clientY: 0, bubbles: true})
                nonToolElement[0].dispatchEvent(event);		
            } else {
                nonToolElement.click();				
            }

            expect(handlers.onClick).toHaveBeenCalled();
            expect(handlers.onClick.calls.argsFor(0)[0]._action).toEqual('');
        });
    });
    
    describe(' :actor', function() {
        
        var cell;
        var x;
        var y;
        
        beforeEach(function() {

            var label = 'new actor';
            x = 50;
            y = 60;
            cell = new joint.shapes.tm.Actor({
                position: {x: x, y: y},
                attr: {text: {text: label}}
            });
            
            graph.addCell(cell);
            
        });
        
        it('should place an actor element', function(){
            
            var selector = 'g[model-id="' + cell.id + '"]';
            expect(diagramElement).toContainElement(selector);
        
        });
        
        it('should set the actor properties', function() {
            
            var testProvidesAuthentication = true;
            cell.providesAuthentication = testProvidesAuthentication;
            expect(cell.providesAuthentication).toEqual(testProvidesAuthentication);
            
            var testReason = 'testReason';
            cell.reasonOutOfScope = testReason;
            expect(cell.reasonOutOfScope).toEqual(testReason);
        });
        
        it('should set the out-of-scope class on the actor', function() {
            
            graph.addCell(cell);
            cell.outOfScope = true;
            expect(cell.outOfScope).toBe(true);  
            expect(diagramElement).toContainElement('rect.element-shape.isOutOfScope');
            cell.outOfScope = false;
            expect(cell.outOfScope).toBe(false); 
            expect(diagramElement).not.toContainElement('rect.element-shape.isOutOfScope');
            
        });
        
        it('should set the has open threats class on the actor', function() {

            cell.hasOpenThreats = true;
            expect(cell.hasOpenThreats).toBe(true);
            expect(diagramElement).toContainElement('rect.element-shape.hasOpenThreats');
            cell.hasOpenThreats = false; 
            expect(cell.hasOpenThreats).toBe(false);    
            expect(diagramElement).not.toContainElement('rect.element-shape.hasOpenThreats');             
        });
        
    });
    
    describe(' :store', function() {
        
        var cell;
        var x;
        var y;
        
        beforeEach(function() {
            
            var label = 'new store';
            x = 50;
            y = 60;
            cell = new joint.shapes.tm.Store({
                position: {x: x, y: y},
                attr: {text: {text: label}}
            });
            
            graph.addCell(cell);
                    
        });
        
        it('should place a store element', function(){
            
            var selector = 'g[model-id="' + cell.id + '"]';
            expect(diagramElement).toContainElement(selector);
            
        });
        
        it('should set the store properties', function() {
            
            var testIsALog = true;
            cell.isALog = testIsALog;
            expect(cell.isALog).toEqual(testIsALog);
            
            var testStoresCredentials = true;
            cell.storesCredentials = testStoresCredentials;
            expect(cell.storesCredentials).toEqual(testStoresCredentials);
            
            var testIsEncrypted = true;
            cell.isEncrypted = testIsEncrypted;
            expect(cell.isEncrypted).toEqual(testIsEncrypted);
            
            var testIsSigned = true;
            cell.isSigned = testIsSigned;
            expect(cell.isSigned).toEqual(testIsSigned);
            
            var testReason = 'testReason';
            cell.reasonOutOfScope = testReason;
            expect(cell.reasonOutOfScope).toEqual(testReason);
        });
        
        it('should set the out-of-scope class on the store', function() {
            
            graph.addCell(cell);
            cell.outOfScope = true;
            expect(cell.outOfScope).toBe(true);
            expect(diagramElement).toContainElement('path.element-shape.isOutOfScope');
            cell.outOfScope = false; 
            expect(cell.outOfScope).toBe(false);    
            expect(diagramElement).not.toContainElement('path.element-shape.isOutOfScope');  
            
        });
        
        it('should set the has open threats class on the store', function() {

            cell.hasOpenThreats = true;
            expect(cell.hasOpenThreats).toBe(true);
            expect(diagramElement).toContainElement('path.element-shape.hasOpenThreats');
            cell.hasOpenThreats = false; 
            expect(cell.hasOpenThreats).toBe(false);    
            expect(diagramElement).not.toContainElement('path.element-shape.hasOpenThreats');             
        });
        
    });
    
    describe(' :boundary', function() {
        
        var cell;
        
        beforeEach(function() {
            
            var source = {x: 50, y: 60};
            var target = {x:100, y: 120};
            
            cell = new joint.shapes.tm.Boundary({
                target: target,
                source: source
            });
             
        });
        
        it('should place a boundary element', function(){
            
            graph.addCell(cell);
            var selector = 'g[model-id="' + cell.id + '"]';
            expect(diagramElement).toContainElement(selector);
        });

        it('should set the boundary label', function(){
                
            var label = 'boundary';	
            cell.setLabel(label);
            graph.addCell(cell);
            expect(diagramElement.find('g.label').find('tspan')[0]).toContainText(label);
        });
        
    });
    
    describe(' :flow',function() {
        
        var cell;
        
        beforeEach(function() {
            
            var source = {x: 50, y: 60};
            var target = {x:100, y: 120};
            
            cell = new joint.shapes.tm.Flow({
                target: target,
                source: source
            });
            
        });
        
        it('should place a flow element', function() {
            
            graph.addCell(cell);
            var selector = 'g[model-id="' + cell.id + '"]';
            expect(diagramElement).toContainElement(selector);
        });
        
        it('should set the flow label', function(){
            
            var label = 'flow';	
            cell.setLabel(label);
            graph.addCell(cell);
            expect(diagramElement.find('g.label').find('tspan')[0]).toContainText(label);
        });
        
        it('should highlight a link', function() {

            graph.addCell(cell);
            var cellView = diagram.findViewByModel(cell);
            //jasmine-jquery hasClass matcher does not work - is it because is SVG?
            var selector = 'g[model-id="' + cell.id + '"]';
            expect($(diagramElement).find(selector).attr('class').indexOf('highlighted') >= 0).toBe(false);
            cellView.setSelected();
            expect($(diagramElement).find(selector).attr('class').indexOf('highlighted') >= 0).toBe(true);
        });
        
        it('should unhighlight a link', function() {

            graph.addCell(cell);
            var cellView = diagram.findViewByModel(cell);
            //jasmine-jquery hasClass matcher does not work - is it because is SVG?
            var selector = 'g[model-id="' + cell.id + '"]';
            cellView.setSelected();
            expect($(diagramElement).find(selector).attr('class').indexOf('highlighted') >= 0).toBe(true);
            cellView.setUnselected();
            expect($(diagramElement).find(selector).attr('class').indexOf('highlighted') >= 0).toBe(false);
        });
        
        it('should set the out of scope class on the flow', function() {
            
            graph.addCell(cell);
            cell.outOfScope = true;
            expect(cell.outOfScope).toBe(true);
            expect(diagramElement).toContainElement('path.connection.isOutOfScope');
            cell.outOfScope = false; 
            expect(cell.outOfScope).toBe(false);    
            expect(diagramElement).not.toContainElement('path.connection.isOutOfScope');  
            
        });
        
         it('should set the has open threats class on the store', function() {

            graph.addCell(cell);
            cell.hasOpenThreats = true;
            expect(cell.hasOpenThreats).toBe(true);
            expect(diagramElement).toContainElement('path.connection.hasOpenThreats');
            cell.hasOpenThreats = false; 
            expect(cell.hasOpenThreats).toBe(false);    
            expect(diagramElement).not.toContainElement('path.connection.hasOpenThreats');             
        });
        
        it('should set the flow properties',function() {
            
            graph.addCell(cell);
            
            var testEncrypted = true;
            cell.isEncrypted = testEncrypted;
            expect(cell.isEncrypted).toEqual(testEncrypted);
            
            var testIsPublicNetwork = true;
            cell.isPublicNetwork = testIsPublicNetwork;
            expect(cell.isPublicNetwork).toEqual(testIsPublicNetwork);
            
            var testProtocol = 'testProtocol';
            cell.protocol = testProtocol;
            expect(cell.protocol).toEqual(testProtocol);
            
        });
    });
	
	it('should place a flow element with source and target', function() {
		
		var source = new joint.shapes.tm.Process({
			position: {x: 50, y: 50},
			attr: {text: {text: 'source'}}
		});
		
		var sourceId = source.cid;
		var target = new joint.shapes.tm.Process({
			position: {x: 150, y: 150},
			attr: {text: {text: 'target'}}
		});
		
		var targetId = target.cid;
		var flow = new joint.shapes.tm.Flow({
			target: target,
			source: source
		});
		
		graph.addCells([source, target, flow]);
		expect(flow.attributes.source.cid).toEqual(sourceId);
		expect(flow.attributes.target.cid).toEqual(targetId);
	});	
});