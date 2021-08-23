import { Shape } from '@antv/x6';

import defaultProperties from '../../entity/default-properties.js';

const name = 'flow';

export const Flow = Shape.Empty.define({
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
    }
});

Flow.prototype.getEdgeConfig = (position) => ({
    source: {
        x: position.x,
        y: position.y
    },
    target: {
        x: position.x + 100,
        y: position.y + 100
    },
    connector: 'smooth',
    attrs: {
        line: {
            strokeWidth: 3,
            sourceMarker: null,
            targetMarker: null
        }
    },
    data: defaultProperties.flow
});

Flow.prototype.type = 'tm.Flow';

Flow.prototype.updateStyle = function () {};

Flow.prototype.setName = function (name) {
    this.setAttrByPath('label/text', name);
};

export default {
    Flow,
    name
};
