import { Shape } from '@antv/x6';

import { tc } from '@/i18n/index.js';

import defaultProperties from '@/service/entity/default-properties.js';

const name = 'flow-stencil';

// stencil item for data flow (edge)
export const FlowStencil = Shape.Path.define({
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
        },
        {
            tagName: 'rect',
            selector: 'customBoundary'
        }
    ],
    attrs: {
        boundary: {
            strokeWidth: 1.5,
            stroke: '#333333',
            fill: 'transparent',
            refD: 'M 30 20 C 70 20 70 100 110 100'
        },
        customBoundary: {
            opacity: 0,
            width: 150,
            height: 80,
        },
        label: {
            text: tc('threatmodel.shapes.flowStencil'),
            fill: '#333',
            textVerticalAnchor: 'middle'
        },
        line: {
            targetMarker: 'block',
            sourceMarker: ''
        }
    },
    data: defaultProperties.defaultData('tm.Flow')
});

FlowStencil.prototype.type = 'tm.FlowStencil';
FlowStencil.prototype.convertToEdge = true;

FlowStencil.prototype.setName = function (name) {
    this.setAttrByPath('label/text', name);
};

FlowStencil.prototype.updateStyle = function () {};

export default {
    FlowStencil,
    name
};
