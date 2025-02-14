import { Shape } from '@antv/x6';

import { tc } from '@/i18n/index.js';
import defaultProperties from '@/service/entity/default-properties';

const name = 'flow';

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
    labels: [
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
                distance: 0.6,
                args: {
                    keepGradient: true,
                    ensureLegibility: true,
                }
            },
        },
    ],
    connector: 'smooth',
    data: defaultProperties.flow
});

Flow.prototype.type = 'tm.Flow';

Flow.prototype.setName = function(name) {
    this.setLabels([name]);
};

Flow.prototype.updateStyle = function(color, dash, strokeWidth, sourceMarker) {
    this.setAttrByPath('line/stroke', color);
    this.setAttrByPath('line/strokeWidth', strokeWidth);
    this.setAttrByPath('line/strokeDasharray', dash);
    this.setAttrByPath('line/sourceMarker/name', sourceMarker);
    this.setAttrByPath('line/targetMarker/name', 'block');
};

Flow.fromEdge = function(edge) {
    return new Flow({
        source: edge.getSourceCell(),
        target: edge.getTargetCell(),
        data: edge.getData()
    });
};

export default {
    Flow,
    name
};
