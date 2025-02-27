import { Shape } from '@antv/x6';

import defaultProperties from '@/service/entity/default-properties';

const name = 'trust-boundary-curve';
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
                text: '',
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

// trust boundary curve (edge, dotted line)
export const TrustBoundaryCurve = Shape.Edge.define({
    constructorName: name,
    width: 200,
    height: 100,
    zIndex: 10,
    attrs: {
        line: {
            strokeWidth: 3,
            strokeDasharray: '10 5',
            sourceMarker: null,
            targetMarker: null
        },
        rect: {
            fill: 'none',
            stroke: 'none'
        },
    },
    labels: defaultLabel,
    connector: 'smooth',
    data: defaultProperties.boundary
});

TrustBoundaryCurve.prototype.type = 'tm.Boundary';

TrustBoundaryCurve.prototype.setName = function (name) {
    this.setLabels([name]); // not a good look, but forces an Edge redraw
    let labels = defaultLabel;
    labels[0].attrs.labelText.text = name;
};

TrustBoundaryCurve.prototype.updateStyle = function () {};

export default {
    name,
    TrustBoundaryCurve
};
