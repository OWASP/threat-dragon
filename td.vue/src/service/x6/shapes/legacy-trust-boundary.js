import { Shape } from '@antv/x6';

const name = 'legacy-trust-boundary';

const path = 'M 100 350 q 150 -300 300 0';

/**
 * A graphical representation of a process (circle, white background)
 * https://x6.antv.vision/en/docs/tutorial/intermediate/custom-node
 * Attrs can use standard SVG attributes (in camelCase)
 * https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute
 */
export const LegacyTrustBoundary = Shape.Path.define({
    height: 120,
    width: 75,
    constructorName: name,
    zIndex: 0,
    label: '(Legacy) Trust Boundary',
    path,
    attrs: {
        body: {
            fill: '',
            fillOpacity: 0,
            stroke: 'green',
            strokeWidth: 3,
            strokeDasharray: '5 5',
        }
    }
});

export default {
    name,
    LegacyTrustBoundary
};
