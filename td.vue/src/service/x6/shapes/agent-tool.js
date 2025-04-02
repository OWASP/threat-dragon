import { Shape } from '@antv/x6';

import { tc } from '@/i18n/index.js';

import { ports } from '../ports.js';

const name = 'agent-tool';

// agent tool (image shape)
export const ToolShape = Shape.Image.define({
    constructorName: name,
    width: 150,
    height: 80,
    zIndex: 0,
    label: tc('threatmodel.shapes.tool'),
    imageUrl: '/assets/agent-tool.svg',
    attrs: {
        image: {
            width: 150,
            height: 80,
            refY: -8
        },
        label: {
            refY: 53
        }
    },
    ports: { ...ports }
});

ToolShape.prototype.type = 'tm.Tool';

ToolShape.prototype.setName = function (name) {
    this.label = name;
};

ToolShape.prototype.updateStyle = function (color, dash, strokeWidth) {
    this.setAttrByPath('label/fill', color);
};

export default {
    ToolShape,
    name
};