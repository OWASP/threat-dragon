import { Shape } from '@antv/x6';

import { tc } from '@/i18n/index.js';

import { ports } from '../ports.js';

const name = 'store';

// store (parallel lines, white background)
export const StoreShape = Shape.Rect.define({
    constructorName: name,
    width: 150,
    height: 75,
    zIndex: 0,
    label: tc('threatmodel.shapes.store'),
    markup: [
        ...Shape.Rect.getMarkup(),
        {
            tagName: 'path',
            selector: 'topLine'
        },
        {
            tagName: 'path',
            selector: 'bottomLine'
        }
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
            fill: 'transparent',
            opacity: 0,
            fillOpacity: 0
        }
    },
    ports: { ...ports }
});

StoreShape.prototype.type = 'tm.Store';

StoreShape.prototype.setName = function (name) {
    this.label = name;
};

StoreShape.prototype.updateStyle = function (color, dash, strokeWidth) {
    this.setAttrByPath('topLine/stroke', color);
    this.setAttrByPath('topLine/strokeWidth', strokeWidth);
    this.setAttrByPath('topLine/strokeDasharray', dash);
    this.setAttrByPath('bottomLine/stroke', color);
    this.setAttrByPath('bottomLine/strokeWidth', strokeWidth);
    this.setAttrByPath('bottomLine/strokeDasharray', dash);
};

export default {
    name,
    StoreShape
};
