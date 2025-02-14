import { Shape } from '@antv/x6';

import { tc } from '@/i18n/index.js';
import defaultProperties from '@/service/entity/default-properties';

const name = 'trust-boundary-curve';

// trust boundary curve (edge, dotted line, gray opaque background))
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
                    text: tc('threatmodel.shapes.trustBoundary'),
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
    data: defaultProperties.boundary
});

TrustBoundaryCurve.prototype.type = 'tm.Boundary';

TrustBoundaryCurve.prototype.setName = function (name) {
    this.setLabels([name]);
};

TrustBoundaryCurve.prototype.updateStyle = function () {};

export default {
    name,
    TrustBoundaryCurve
};
