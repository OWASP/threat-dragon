
if (typeof exports === 'object') {

    var joint = {
        util: require('../src/core').util,
        shapes: {
            basic: require('./joint.shapes.basic')
        },
        dia: {
            Element: require('../src/joint.dia.element').Element,
            Link: require('../src/joint.dia.link').Link
        }
    };
}

joint.shapes.tm = {};

joint.shapes.tm.Flow = joint.dia.Link.extend({

    arrowheadMarkup: [
    '<g class="marker-arrowhead-group marker-arrowhead-group-<%= end %>">',
    '<circle class="marker-arrowhead" end="<%= end %>" r="6" />',
    '</g>'
    ].join(''),

    setLabel: function (labelText) { this.attributes.labels = [{ position: 0.5, attrs: { text: { text: labelText, 'font-weight': '400', 'font-size': 'small' } } }]; },

    defaults: joint.util.deepSupplement({
        type: 'tm.Flow',
        attrs: {
            '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' }
        },
        smooth: true
    }, joint.dia.Link.prototype.defaults)
});

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
        attrs: {
            '.connection': { stroke: 'red', 'stroke-dasharray': '10,5' }
        },
        smooth: true
    }, joint.dia.Link.prototype.defaults)
});

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

joint.shapes.tm.Process = joint.shapes.tm.toolElement.extend({

    markup: '<g class="rotatable"><g class="scalable"><circle class="element-process"/><title class="tooltip"/></g><text/></g>',

    defaults: joint.util.deepSupplement({
        type: 'tm.Process',
        attrs: {
            '.element-process': { 'stroke-width': 1, r: 30, stroke: 'black', transform: 'translate(30, 30)' },
            text: { ref: '.element-process'}
        },
        size: { width: 100, height: 100 }
    }, joint.shapes.tm.toolElement.prototype.defaults)
});

joint.shapes.tm.Store = joint.shapes.tm.toolElement.extend({

    markup: '<g class="rotatable"><g class="scalable"><rect/><path class="element-store"/><title class="tooltip"/></g><text/></g>',
    
    defaults: joint.util.deepSupplement({
    
        type: 'tm.Store',
        attrs: {
            rect: { fill: 'white', stroke: 'white', 'follow-scale': true, width: 160, height: 80 },
            '.element-store': { d: 'M0 0 H160 M0 80 H160', stroke: 'black', fill: 'white', 'stroke-width': 1, 'follow-scale': true},
            text: { ref: 'path' }
        },
        size: { width: 160, height: 80 }
    }, joint.shapes.tm.toolElement.prototype.defaults)
});

joint.shapes.tm.Actor = joint.shapes.tm.toolElement.extend({

    markup: '<g class="rotatable"><g class="scalable"><rect/><title class="tooltip"/></g><text/></g>',

    defaults: joint.util.deepSupplement({

        type: 'tm.Actor',
        attrs: {
            rect: { fill: 'white', stroke: 'black', 'stroke-width': 1, 'follow-scale': true, width: 160, height: 80 },
            text: { ref: 'rect'}
        },
        size: { width: 160, height: 80 }
    }, joint.shapes.tm.toolElement.prototype.defaults)
});

joint.shapes.tm.ToolElementView = joint.dia.ElementView.extend({

    initialize: function() {

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
        this.highlight();
    },

    setUnselected: function () {
        this.unhighlight();
    }
});

joint.shapes.tm.StoreView = joint.shapes.tm.ToolElementView;

joint.shapes.tm.ActorView = joint.shapes.tm.ToolElementView;

joint.shapes.tm.ProcessView = joint.shapes.tm.ToolElementView;

joint.shapes.tm.LinkView = joint.dia.LinkView.extend({

    setSelected: function () {
        this.highlight();
    },
    setUnselected: function () {
        this.unhighlight();
    }
});

joint.shapes.tm.FlowView = joint.shapes.tm.LinkView;

joint.shapes.tm.BoundaryView = joint.shapes.tm.LinkView;

if (typeof exports === 'object') {

    module.exports = joint.shapes.tm;
}

