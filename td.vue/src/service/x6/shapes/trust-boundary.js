import { Shape } from '@antv/x6';

const name = 'trust-boundary';

/**
 * A trust boundary shape (dotted line, gray opaque background)
 * https://x6.antv.vision/en/docs/tutorial/intermediate/custom-node
 * Attrs can use standard SVG attributes (in camelCase)
 * https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute
 */
export const TrustBoundary = Shape.HeaderedRect.define({
    constructorName: 'trust-boundary',
    width: 500,
    height: 600,
    zIndex: -50,
    attrs: {
        body: {
            rx: 10,
            ry: 10,
            strokeWidth: 1,
            strokeDasharray: '5 5',
            stroke: '#5755a1',
            fill: '#777',
            fillOpacity: 0.2
        },
        headerText: {
            text: 'Trust Boundary',
            fill: '#e95420',
            strokeWidth: 0,
        },
        header: {
            rx: 10,
            ry: 10,
            fill: '#777',
            fillOpacity: 0.2,
            strokeWidth: 0
        }
    }
});

export default {
    name,
    TrustBoundary
};
