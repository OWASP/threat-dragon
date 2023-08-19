import { Shape } from '@antv/x6';

import { tc } from '@/i18n/index.js';

import defaultProperties from '../../entity/default-properties.js';

const name = 'trust-boundary-curve-stencil';

/**
 * A trust boundary shape (dotted line, gray opaque background)
 * https://x6.antv.vision/en/docs/tutorial/intermediate/custom-node
 * Attrs can use standard SVG attributes (in camelCase)
 * https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute
 */
export const TrustBoundaryCurveStencil = Shape.Edge.define({
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
        }
    ],
    attrs: {
        boundary: {
            strokeWidth: 3,
            stroke: '#333333',
            fill: '#ffffff',
            strokeDasharray: '5 5',
            refD: 'M 30 20 C 70 20 70 100 110 100'
        },
        label: {
            text: tc('threatmodel.shapes.trustBoundary'),
            fill: '#333',
            textVerticalAnchor: 'middle'
        }
    },
    data: defaultProperties.boundary
});

TrustBoundaryCurveStencil.prototype.type = 'tm.BoundaryStencil';
//TrustBoundaryCurveStencil.prototype.convertToEdge = true;

TrustBoundaryCurveStencil.prototype.setName = function (name) {
    this.setAttrByPath('label/text', name);
};

TrustBoundaryCurveStencil.prototype.updateStyle = function () {};

export default {
    name,
    TrustBoundaryCurveStencil
};
