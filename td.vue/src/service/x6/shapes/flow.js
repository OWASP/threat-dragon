import { Shape } from '@antv/x6';

import { tc } from '@/i18n/index.js';
import defaultProperties from '@/service/entity/default-properties';

const name = 'flow';
const defaultLabel = [
    {
        markup: [
            {
                tagName: 'ellipse',
                selector: 'labelBody',
            },
            {
                tagName: 'text',
                selector: 'labelText',
            },
        ],
        attrs: {
            labelText: {
                text: tc('threatmodel.shapes.flow'),
                textAnchor: 'middle',
                textVerticalAnchor: 'middle',
            },
            labelBody: {
                ref: 'labelText',
                refRx: '50%',
                refRy: '60%',
                fill: '#fff',
                strokeWidth: 0,
            },
        },
        position: {
            distance: 0.5,
            args: {
                keepGradient: true,
                ensureLegibility: true,
            }
        },
    }
];

// data flow (edge)
export const Flow = Shape.Edge.define({
    constructorName: name,
    width: 200,
    height: 100,
    zIndex: 10,
    attrs: {
        line: {
            strokeWidth: 1.5,
            sourceMarker: null,
            targetMarker: 'block'
        },
        rect: {
            fill: 'none',
            stroke: 'none'
        },
    },
    labels: defaultLabel,
    connector: 'smooth',
    data: defaultProperties.flow
});

Flow.prototype.type = 'tm.Flow';

Flow.prototype.setName = function(name) {
    this.setLabels([name]); // not a good look, but forces an Edge redraw
    let labels = defaultLabel;
    labels[0].attrs.labelText.text = name;
    this.setLabels(labels);
};

Flow.prototype.updateStyle = function(color, dash, strokeWidth, sourceMarker) {
    this.setAttrByPath('line/stroke', color);
    this.setAttrByPath('line/strokeWidth', strokeWidth);
    this.setAttrByPath('line/strokeDasharray', dash);
    this.setAttrByPath('line/sourceMarker/name', sourceMarker);
    this.setAttrByPath('line/targetMarker/name', 'block');
};

// a new edge (not flow) is created by AntV/X6 from an existing node port
// and then needs to be converted to a Flow
Flow.fromEdge = function(edge) {
    return new Flow({
        source: edge.getSource(),
        target: edge.getTarget(),
        data: edge.getData(),
        vertices: edge.getVertices()
    });
};

export default {
    Flow,
    name
};
