'use strict';

var joint = require('jointjs');
var V = joint.V;

joint.shapes.tm = {};

joint.shapes.tm.Highlighter = {
    highlighter: {
        name: 'addClass',
        options: {
            className: 'highlighted'
        }
    }
};

//utility functions for threat model shapes

joint.shapes.tm.utils = {

    shapeFromClassName: function (str) {
        var arr = str.split(".");
        /*jshint validthis: true */
        var fn = (window || this);
        for (var i = 0, len = arr.length; i < len; i++) {
            fn = fn[arr[i]];
        }

        fn = require('jointjs')[fn];

        if (typeof fn !== "function") {
            throw new Error("function not found");
        }

        return fn;
    },

    editNameElement: function (element, value) {
        element.attr('text/text', this.wordWrap(element, value));
    },

    editNameLink: function (element, value) {
        element.label(0, { attrs: { text: { text: this.wordWrap(element, value) } } });
    },

    wordWrap: function (element, text) {

        var size = element.isLink() ? { width: 140, height: 80 } : element.get('size');
        return joint.util.breakText(text, size, {});
    },

    //since i'm an idiot with regex - the final gm is to ensure all instances are matched (g)
    //across all line (m)
    wordUnwrap: function (text) {
        var regex = /\n/gm;
        return text.replace(regex, ' ');
    },

    defineProperties: function (proto, properties) {

        properties.forEach(function (property) {
            Object.defineProperty(proto, property, {
                get: function () { return this.prop(property); },
                set: function (value) { this.prop(property, value); }
            });
        });
    },

    defineOutOfScope: function (proto, selectorClass) {

        Object.defineProperty(proto, 'outOfScope', {
            get: function () { return this.prop('outOfScope'); },
            set: function (value) {

                var selector = '.' + selectorClass + '/class';
                var originalClass = this.attr(selector) || selectorClass + ' hasNoOpenThreats isInScope';

                if (value) {
                    this.attr(selector, originalClass.replace('isInScope', 'isOutOfScope'));
                }
                else {
                    this.attr(selector, originalClass.replace('isOutOfScope', 'isInScope'));
                }

                this.prop('outOfScope', value);
            }
        });
    },

    defineHasOpenThreats: function (proto, selectorClasses) {

        Object.defineProperty(proto, 'hasOpenThreats', {
            get: function () { return this.prop('hasOpenThreats'); },
            set: function (value) {

                var element = this;

                selectorClasses.forEach(function (selectorClass) {

                    var selector = '.' + selectorClass + '/class';
                    var originalClass = element.attr(selector) || selectorClass + ' hasNoOpenThreats isInScope';

                    if (value) {
                        element.attr(selector, originalClass.replace('hasNoOpenThreats', 'hasOpenThreats'));
                    }
                    else {
                        element.attr(selector, originalClass.replace('hasOpenThreats', 'hasNoOpenThreats'));
                    }

                });

                this.prop('hasOpenThreats', value);
            }
        });
    }
};

//data flow shape

joint.shapes.tm.Flow = joint.dia.Link.extend({

    arrowheadMarkup: [
        '<g class="marker-arrowhead-group marker-arrowhead-group-<%= end %>">',
        '<circle class="marker-arrowhead" end="<%= end %>" r="6" />',
        '</g>'
    ].join(''),

    setLabel: function (labelText) { this.attributes.labels = [{ position: 0.5, attrs: { text: { text: labelText, 'font-weight': '400', 'font-size': 'small' } } }]; },

    defaults: joint.util.deepSupplement({
        type: 'tm.Flow',
        size: { width: 10, height: 10 },
        attrs: {
            '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' }
        },
        smooth: true
    }, joint.dia.Link.prototype.defaults)
});

//flow element properties

Object.defineProperty(joint.shapes.tm.Flow.prototype, 'name', {
    get: function () { return joint.shapes.tm.utils.wordUnwrap(this.attributes.labels[0].attrs.text.text); },
    set: function (value) { joint.shapes.tm.utils.editNameLink(this, value); }
});

joint.shapes.tm.utils.defineOutOfScope(joint.shapes.tm.Flow.prototype, 'connection');
joint.shapes.tm.utils.defineHasOpenThreats(joint.shapes.tm.Flow.prototype, ['connection', 'marker-target']);
joint.shapes.tm.utils.defineProperties(joint.shapes.tm.Flow.prototype, ['description', 'reasonOutOfScope', 'protocol', 'isEncrypted', 'isPublicNetwork', 'threats']);

//trust boundary shape

joint.shapes.tm.Boundary = joint.dia.Link.extend({

    markup: [
        '<path class="connection" stroke="black"/>',
        '<path class="marker-source" fill="black" stroke="black" />',
        '<path class="marker-target" fill="black" stroke="black" />',
        '<path class="connection-wrap"/><title class="tooltip"></title>',
        '<g class="labels"/>',
        '<g class="marker-vertices"/>',
        '<g class="marker-arrowheads"/>',
        '<g class="link-tools"/>'
    ].join(''),

    arrowheadMarkup: [
        '<g class="marker-arrowhead-group marker-arrowhead-group-<%= end %>">',
        '<circle class="marker-arrowhead" end="<%= end %>" r="6" />',
        '</g>'
    ].join(''),

    setLabel: function (labelText) { this.attributes.labels = [{ position: 0.5, attrs: { text: { text: labelText, 'font-weight': '400', 'font-size': 'small' } } }]; },

    defaults: joint.util.deepSupplement({
        type: 'tm.Boundary',
        size: { width: 10, height: 10 },
        attrs: {
            '.connection': { stroke: 'black', 'stroke-width': 3, 'stroke-dasharray': '10,5' }
        },
        smooth: true
    }, joint.dia.Link.prototype.defaults)
});

//trust boundary properties

Object.defineProperty(joint.shapes.tm.Boundary.prototype, 'name', {
    get: function () { 
            //Need to make it backward compatible with prev versions that do not have name 
            //on the boundaries by creating an empty string field
            var nameProperty = "";
            if ('labels' in this.attributes) {
                nameProperty = this.attributes.labels[0].attrs.text.text;
            }
            return joint.shapes.tm.utils.wordUnwrap(nameProperty); 
        },
    set: function (value) { 
            joint.shapes.tm.utils.editNameLink(this, value); 

            //For backward compatibility: Adjust old boundary attributes with current ones
            if (!('font-weight' in this.attributes.labels[0].attrs.text) || !('font-size' in this.attributes.labels[0].attrs.text)) {
                this.attributes.labels[0] = { position: 0.5, attrs: { text: { text: value, 'font-weight': '400', 'font-size': 'small' } } };
                
                var diagramData = { diagramJson: { cells: this.graph.getCells() } };
                this.graph.initialise(diagramData.diagramJson);
            }
        }
});

//element with tool bar

joint.shapes.tm.toolElement = joint.shapes.basic.Generic.extend({

    toolMarkup: ['<g class="element-tools">',
        '<g class="element-tool-remove"><circle fill="red" r="11"/>',
        '<path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z"/>',
        '<title>Remove this element from the model</title>',
        '</g>',
        '<g class="element-tool-link"><circle r="11" transform="translate(23,0)"/>',
        '<path fill="none" stroke="white" stroke-width="6" transform="scale (0.7) translate(20.86, 11)" d="m6.5 -1.47 l13.5 -9.53 l-13.5 -9.53"/> ',
        '<title>Link from here</title>',
        '</g>',
        '</g>'].join(''),

    defaults: joint.util.deepSupplement({
        attrs: {
            text: { 'font-weight': 400, 'font-size': 'small', fill: 'black', 'text-anchor': 'middle', 'ref-x': 0.5, 'ref-y': 0.5, 'y-alignment': 'middle' },
        },
    }, joint.shapes.basic.Generic.prototype.defaults)

});

//tool element properties

Object.defineProperty(joint.shapes.tm.toolElement.prototype, 'name', {
    get: function () { return joint.shapes.tm.utils.wordUnwrap(this.attr('text/text')); },
    set: function (value) { joint.shapes.tm.utils.editNameElement(this, value); }
});

joint.shapes.tm.utils.defineProperties(joint.shapes.tm.toolElement.prototype, ['description', 'reasonOutOfScope', 'threats']);
joint.shapes.tm.utils.defineOutOfScope(joint.shapes.tm.toolElement.prototype, 'element-shape');
joint.shapes.tm.utils.defineHasOpenThreats(joint.shapes.tm.toolElement.prototype, ['element-shape', 'element-text']);

//process element shape

joint.shapes.tm.Process = joint.shapes.tm.toolElement.extend({

    markup: '<g class="rotatable"><g class="scalable"><circle class="element-shape hasNoOpenThreats isInScope"/><title class="tooltip"/></g><text class="element-text hasNoOpenThreats isInScope"/></g>',

    defaults: joint.util.deepSupplement({
        type: 'tm.Process',
        attrs: {
            '.element-shape': { 'stroke-width': 1, r: 30, stroke: 'black', transform: 'translate(30, 30)' },
            text: { ref: '.element-shape' }
        },
        size: { width: 100, height: 100 }
    }, joint.shapes.tm.toolElement.prototype.defaults)
});

//define process element properties

joint.shapes.tm.utils.defineProperties(joint.shapes.tm.Process.prototype, ['privilegeLevel']);

//data store element shape

joint.shapes.tm.Store = joint.shapes.tm.toolElement.extend({

    markup: '<g class="rotatable"><g class="scalable"><rect/><path class="element-shape hasNoOpenThreats isInScope"/><title class="tooltip"/></g><text class="element-text hasNoOpenThreats isInScope"/></g>',

    defaults: joint.util.deepSupplement({

        type: 'tm.Store',
        attrs: {
            rect: { fill: 'white', stroke: 'white', 'follow-scale': true, width: 160, height: 80 },
            '.element-shape': { d: 'M0 0 H160 M0 80 H160', stroke: 'black', fill: 'white', 'stroke-width': 1, 'follow-scale': true },
            text: { ref: '.element-shape' }
        },
        size: { width: 160, height: 80 }
    }, joint.shapes.tm.toolElement.prototype.defaults)
});

//data store properties

joint.shapes.tm.utils.defineProperties(joint.shapes.tm.Store.prototype, ['isALog', 'storesCredentials', 'isEncrypted', 'isSigned']);

//actor element shape

joint.shapes.tm.Actor = joint.shapes.tm.toolElement.extend({

    markup: '<g class="rotatable"><g class="scalable"><rect class="element-shape hasNoOpenThreats isInScope"/><title class="tooltip"/></g><text class="element-text hasNoOpenThreats isInScope"/></g>',

    defaults: joint.util.deepSupplement({

        type: 'tm.Actor',
        attrs: {
            '.element-shape': { fill: 'white', stroke: 'black', 'stroke-width': 1, 'follow-scale': true, width: 160, height: 80 },
            text: { ref: '.element-shape' }
        },
        size: { width: 160, height: 80 }
    }, joint.shapes.tm.toolElement.prototype.defaults)
});

//actor properties

joint.shapes.tm.utils.defineProperties(joint.shapes.tm.Store.prototype, ['providesAuthentication']);

//custom views

joint.shapes.tm.ToolElementView = joint.dia.ElementView.extend({

    initialize: function () {

        joint.dia.ElementView.prototype.initialize.apply(this, arguments);
    },

    render: function () {

        joint.dia.ElementView.prototype.render.apply(this, arguments);

        this.renderTools();
        this.update();

        return this;
    },

    renderTools: function () {

        var toolMarkup = this.model.toolMarkup || this.model.get('toolMarkup');

        if (toolMarkup) {

            var nodes = V(toolMarkup);
            V(this.el).append(nodes);

        }

        return this;
    },

    pointerclick: function (evt, x, y) {

        this._dx = x;
        this._dy = y;
        this._action = '';

        var className = evt.target.parentNode.getAttribute('class');

        switch (className) {

            case 'element-tool-remove':
                this.model.remove();
                return;

            case 'element-tool-link':
                this._action = 'linkFrom';
                break;

            case 'element-tool-link linking':
                this._action = 'removeLinkFrom';
                break;

            default:
        }

        joint.dia.CellView.prototype.pointerclick.apply(this, arguments);
    },

    setSelected: function () {
        this.highlight(null, joint.shapes.tm.Highlighter);
    },
    setUnselected: function () {
        this.unhighlight(null, joint.shapes.tm.Highlighter);
    },
    addLinkFrom: function () {
        this.linkFrom = true;
        (new V(this.$el.find('.element-tool-link')[0])).addClass("linking");
    },
    removeLinkFrom: function () {
        this.linkFrom = false;
        (new V(this.$el.find('.element-tool-link')[0])).removeClass("linking");
    }
});

joint.shapes.tm.StoreView = joint.shapes.tm.ToolElementView;

joint.shapes.tm.ActorView = joint.shapes.tm.ToolElementView;

joint.shapes.tm.ProcessView = joint.shapes.tm.ToolElementView;

joint.shapes.tm.LinkView = joint.dia.LinkView.extend({

    setSelected: function () {
        this.highlight(null, joint.shapes.tm.Highlighter);
    },
    setUnselected: function () {
        this.unhighlight(null, joint.shapes.tm.Highlighter);
    }
});

joint.shapes.tm.FlowView = joint.shapes.tm.LinkView;

joint.shapes.tm.BoundaryView = joint.shapes.tm.LinkView;

if (typeof exports === 'object') {

    module.exports = joint.shapes.tm;
}
