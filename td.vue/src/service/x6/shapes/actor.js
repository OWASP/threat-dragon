import { Shape } from '@antv/x6';

import { tc } from '@/i18n/index.js';

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
    label: tc('threatmodel.shapes.actor'),
    attrs: {
        body: {
            magnet: true
        }
    }
});
Actor.prototype.type = 'tm.Actor';

Actor.prototype.updateStyle = function(color, dash, strokeWidth) {
    this.setAttrByPath('body/stroke', color);
    this.setAttrByPath('body/strokeWidth', strokeWidth);
    this.setAttrByPath('body/strokeDasharray', dash);
};


Actor.prototype.setName = function (name) {
    this.label = name;
};

export default {
    Actor,
    name
};
