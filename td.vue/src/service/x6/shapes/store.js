import { Shape } from '@antv/x6';

const name = 'store';

/**
 * A graphical representation of a store (cylinder, white background)
 * https://x6.antv.vision/en/docs/tutorial/intermediate/custom-node
 * Attrs can use standard SVG attributes (in camelCase)
 * https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute
 */
export const Store = Shape.Cylinder.define({
    height: 120,
    width: 200,
    constructorName: name,
    zIndex: 0,
    label: 'Store',
    attrs: {
        body: {
            magnet: true
        }
    }
});

export default {
    name,
    Store
};
