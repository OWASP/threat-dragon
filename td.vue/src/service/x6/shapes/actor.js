import { Shape } from '@antv/x6';

import { tc } from '@/i18n/index.js';

import { ports } from '../ports.js';

const name = 'actor';

// actor (rectangle, transparent background)
export const ActorShape = Shape.Rect.define({
    constructorName: name,
    width: 150,
    height: 80,
    zIndex: 0,
    label: tc('threatmodel.shapes.actor'),
    attrs: {
        body: {
            fill: 'transparent',
            fillOpacity: 0
        }
    },
    ports: { ...ports }
});

ActorShape.prototype.type = 'tm.Actor';

ActorShape.prototype.setName = function (name) {
    this.label = name;
};

ActorShape.prototype.updateStyle = function (color, dash, strokeWidth) {
    this.setAttrByPath('body/stroke', color);
    this.setAttrByPath('body/strokeWidth', strokeWidth);
    this.setAttrByPath('body/strokeDasharray', dash);
};

export default {
    ActorShape,
    name
};
