import { Shape } from '@antv/x6';

const name = 'actor';

/**
 * A graphical representation of an actor (rectangle, white background)
 * https://x6.antv.vision/en/docs/tutorial/intermediate/custom-node
 * Attrs can use standard SVG attributes (in camelCase)
 * https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute
 */
export const Actor = Shape.Rect.define({
    height: 80,
    width: 120,
    constructorName: 'actor',
    zIndex: 0,
    label: 'Actor'
});

export default {
    name,
    Actor
};
