import { Shape } from '@antv/x6';

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
            stroke: 'green',
            strokeWidth: 3,
            fill: '#ffffff',
            strokeDasharray: '5 5',
            fillOpacity: 0,
            refD: 'M 100 350 t 150 -300 300 0'
        },
        label: {
            text: 'Trust Boundary',
            fill: '#333',
            textVerticalAnchor: 35
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
            stroke: 'green',
            strokeWidth: 3,
            strokeDasharray: '5 5',
            sourceMarker: null,
            targetMarker: null
        }
    }
});

export default {
    getEdgeConfig,
    name,
    TrustBoundaryCurve
};
