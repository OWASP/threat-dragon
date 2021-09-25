import { Shape } from '@antv/x6';

import defaultProperties from '../../entity/default-properties.js';

const name = 'flow-stencil';

export const FlowStencil = Shape.Empty.define({
    constructorName: name,
    width: 200,
    height: 100,
    zIndex: 10,
    markup: [
        {
            tagName: 'path',
            selector: 'boundary'
        },
        {
            tagName: 'text',
            selector: 'label'
        }
    ],
    attrs: {
        boundary: {
            strokeWidth: 1,
            stroke: '#333333',
            fill: '#ffffff',
            refD: 'M 30 20 C 70 20 70 100 110 100'
        },
        label: {
            text: 'Data Flow',
            fill: '#333',
            textVerticalAnchor: 'middle'
        }
    },
    data: defaultProperties.flow
});

FlowStencil.prototype.type = 'tm.FlowStencil';
FlowStencil.prototype.convertToEdge = true;

FlowStencil.prototype.updateStyle = function () {};

FlowStencil.prototype.setName = function (name) {
    this.setAttrByPath('label/text', name);
};

export default {
    FlowStencil,
    name
};
