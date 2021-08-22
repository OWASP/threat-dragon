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
    width: 150,
    constructorName: name,
    zIndex: 0,
    label: 'Actor',
    attrs: {
        body: {
            magnet: true
        }
    }
});

const updateStyle = (cell, color, dash, strokeWidth) => {
    cell.setAttrByPath('body/stroke', color);
    cell.setAttrByPath('body/strokeWidth', strokeWidth);
    cell.setAttrByPath('body/strokeDasharray', dash);
};

Actor.prototype.type = 'tm.Actor';

export default {
    Actor,
    name,
    updateStyle
};
