import { Shape } from '@antv/x6';

import { tc } from '@/i18n/index.js';

import { ports } from '../ports.js';

const name = 'agent';

// agent (image shape)
export const AgentShape = Shape.Image.define({
    constructorName: name,
    width: 150,
    height: 80,
    zIndex: 0,
    label: tc('threatmodel.shapes.agent'),
    imageUrl: '/assets/agent.svg',
    attrs: {
        image: {
            width: 150,
            height: 80,
            refY: -7
        },
        label: {
            refY: 60
        }
    },
    ports: { ...ports }
});

AgentShape.prototype.type = 'tm.Agent';

AgentShape.prototype.setName = function (name) {
    this.label = name;
};

AgentShape.prototype.updateStyle = function (color, dash, strokeWidth) {
    this.setAttrByPath('label/fill', color);
};

export default {
    AgentShape,
    name
};