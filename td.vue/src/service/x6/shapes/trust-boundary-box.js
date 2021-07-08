import { Shape } from '@antv/x6';

const name = 'trust-boundary-box';

/**
 * A trust boundary shape (dotted line, gray opaque background)
 * https://x6.antv.vision/en/docs/tutorial/intermediate/custom-node
 * Attrs can use standard SVG attributes (in camelCase)
 * https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute
 */
export const TrustBoundaryBox = Shape.HeaderedRect.define({
    constructorName: name,
    width: 500,
    height: 400,
    zIndex: -50,
    attrs: {
        body: {
            rx: 10,
            ry: 10,
            strokeDasharray: '5 5',
            strokeWidth: 3,
            fillOpacity: 0
        },
        headerText: {
            text: 'Trust Boundary',
            fill: '#333',
            strokeWidth: 0,
        },
        header: {
            rx: 10,
            ry: 10,
            strokeWidth: 0,
            fillOpacity: 0
        }
    }
});

export default {
    name,
    TrustBoundaryBox
};
