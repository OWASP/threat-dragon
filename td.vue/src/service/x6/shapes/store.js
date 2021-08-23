import { ObjectExt, Shape } from '@antv/x6';

const name = 'store';

const propHooks = (metadata) => {
    const { label, ...others } = metadata;
    if (label) {
        ObjectExt.setByPath(others, 'attrs/label/text', label);
    }
    return others;
};

/**
 * A graphical representation of a store (cylinder, white background)
 * https://x6.antv.vision/en/docs/tutorial/intermediate/custom-node
 * Attrs can use standard SVG attributes (in camelCase)
 * https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute
 */
export const Store = Shape.Rect.define({
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
    label: 'Store',
    propHooks
});

Store.prototype.type = 'tm.Store';

Store.prototype.setName = function (name) {
    this.label = name;
};

Store.prototype.updateStyle = function (color, dash, strokeWidth) {
    this.setAttrByPath('topLine/stroke', color);
    this.setAttrByPath('topLine/strokeWidth', strokeWidth);
    this.setAttrByPath('topLine/strokeDasharray', dash);
    this.setAttrByPath('bottomLine/stroke', color);
    this.setAttrByPath('bottomLine/strokeWidth', strokeWidth);
    this.setAttrByPath('bottomLine/strokeDasharray', dash);
};

export default {
    name,
    propHooks,
    Store
};
