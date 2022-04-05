import { Shape } from '@antv/x6';

import { tc } from '@/i18n/index.js';

const name = 'process';

/**
 * A graphical representation of a process (circle, white background)
 * https://x6.antv.vision/en/docs/tutorial/intermediate/custom-node
 * Attrs can use standard SVG attributes (in camelCase)
 * https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute
 */
export const ProcessShape = Shape.Circle.define({
    height: 200,
    width: 200,
    constructorName: name,
    zIndex: 0,
    label: tc('threatmodel.shapes.process'),
    attrs: {
        body: {
            magnet: false      //needs to be disabled to grab whole shape
        }
    }
});

ProcessShape.prototype.updateStyle = function (color, dash, strokeWidth) {
    this.setAttrByPath('body/stroke', color);
    this.setAttrByPath('body/strokeWidth', strokeWidth);
    this.setAttrByPath('body/strokeDasharray', dash);
};

ProcessShape.prototype.type = 'tm.Process';

ProcessShape.prototype.setName = function (name) {
    this.label = name;
};

export default {
    name,
    ProcessShape
};
