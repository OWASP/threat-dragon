import { Shape } from '@antv/x6';

import { tc } from '@/i18n/index.js';

const name = 'store';

/**
 * A graphical representation of a store (parallel lines, white background)
 * https://x6.antv.vision/en/docs/tutorial/intermediate/custom-node
 * Attrs can use standard SVG attributes (in camelCase)
 * https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute
 */
export const StoreShape = Shape.Rect.define({
    width: 150,
    height: 75,
    constructorName: name,
    markup: [
        ...Shape.Rect.getMarkup(),
        {
            tagName: 'path',
            selector: 'topLine'
        },
        {
            tagName: 'path',
            selector: 'bottomLine'
        },
    ],
    attrs: {
        topLine: {
            stroke: '#333333',
            strokeWidth: 2,
            refD: 'M 0 0 l 200 0'
        },
        bottomLine: {
            stroke: '#333333',
            strokeWidth: 2,
            refDy: 0,
            refD: 'M 0 0 l 100 0'
        },
        body: {
            opacity: 0,
            magnet: true
        }
    },
    label: tc('threatmodel.shapes.store')
});

StoreShape.prototype.updateStyle = function (color, dash, strokeWidth) {
    this.setAttrByPath('topLine/stroke', color);
    this.setAttrByPath('topLine/strokeWidth', strokeWidth);
    this.setAttrByPath('topLine/strokeDasharray', dash);
    this.setAttrByPath('bottomLine/stroke', color);
    this.setAttrByPath('bottomLine/strokeWidth', strokeWidth);
    this.setAttrByPath('bottomLine/strokeDasharray', dash);
};

StoreShape.prototype.type = 'tm.Store';

StoreShape.prototype.setName = function (name) {
    this.label = name;
};

export default {
    name,
    StoreShape
};
