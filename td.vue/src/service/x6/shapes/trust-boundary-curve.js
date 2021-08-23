import { Shape } from '@antv/x6';

import defaultProperties from '../../entity/default-properties.js';

const name = 'trust-boundary-curve';

/**
 * A trust boundary shape (dotted line, gray opaque background)
 * https://x6.antv.vision/en/docs/tutorial/intermediate/custom-node
 * Attrs can use standard SVG attributes (in camelCase)
 * https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute
 */
export const TrustBoundaryCurve = Shape.Empty.define({
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
            text: 'Trust Boundary',
            fill: '#333',
            textVerticalAnchor: 'middle'
        }
    }
});

const getEdgeConfig = (position) => ({
    source: {
        x: position.x,
        y: position.y
    },
    target: {
        x: position.x + 100,
        y: position.y + 100
    },
    connector: 'smooth',
    attrs: {
        line: {
            strokeWidth: 3,
            strokeDasharray: '5 5',
            sourceMarker: null,
            targetMarker: null
        }
    },
    data: defaultProperties.boundary
});

TrustBoundaryCurve.prototype.type = 'tm.Boundary';

export default {
    getEdgeConfig,
    name,
    TrustBoundaryCurve
};
