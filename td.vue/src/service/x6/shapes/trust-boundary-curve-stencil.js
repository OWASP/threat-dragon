import { Shape } from '@antv/x6';

import { tc } from '@/i18n/index.js';

import defaultProperties from '@/service/entity/default-properties.js';

const name = 'trust-boundary-curve-stencil';

// trust boundary curve (edge, dotted line, gray opaque background)
export const TrustBoundaryCurveStencil = Shape.Path.define({
    constructorName: name,
    width: 200,
    height: 100,
    zIndex: 10,
    markup: [
        {
            tagName: 'path',
            selector: 'boundary'
        },
        {
            tagName: 'text',
            selector: 'label'
        },
        {
            tagName: 'rect',
            selector: 'customBoundary'
        }
    ],
    attrs: {
        boundary: {
            strokeWidth: 3,
            stroke: '#333333',
            fill: 'transparent',
            strokeDasharray: '10 5',
            refD: 'M 30 20 C 70 20 70 100 110 100'
        },
        customBoundary: {
            opacity: 0,
            width: 150,
            height: 80,
        },
        label: {
            text: tc('threatmodel.shapes.trustBoundary'),
            fill: '#333',
            textVerticalAnchor: 'middle'
        }
    },
    data: defaultProperties.defaultData('tm.Boundary')
});

TrustBoundaryCurveStencil.prototype.type = 'tm.BoundaryStencil';
TrustBoundaryCurveStencil.prototype.convertToEdge = true;

TrustBoundaryCurveStencil.prototype.setName = function (name) {
    this.setAttrByPath('label/text', name);
};

TrustBoundaryCurveStencil.prototype.updateStyle = function () {};

export default {
    name,
    TrustBoundaryCurveStencil
};
