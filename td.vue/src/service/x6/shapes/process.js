import { Shape } from '@antv/x6';

import { tc } from '@/i18n/index.js';

import { ports } from '../ports.js';

const name = 'process';

// process (circle, white background)
export const ProcessShape = Shape.Circle.define({
    constructorName: name,
    width: 100,
    height: 100,
    zIndex: 0,
    label: tc('threatmodel.shapes.process'),
    markup: [
        ...Shape.Circle.getMarkup(),
        // Prevent the remove button from disappearing when the cursor
        // leaves the circle by having an invisible rectangle slightly larger
        // than the main circle
        {
            tagName: 'rect',
            selector: 'customBoundary'
        }
    ],
    attrs: {
        customBoundary: {
            opacity: 0,
            refWidth: '110%', // intentionally over-sized for usability
            refHeight: '110%'
        },
        body: {
            fill: 'transparent'
        }
    },
    ports: { ...ports }
});

ProcessShape.prototype.type = 'tm.Process';

ProcessShape.prototype.setName = function (name) {
    this.label = name;
};

ProcessShape.prototype.updateStyle = function (color, dash, strokeWidth) {
    this.setAttrByPath('body/stroke', color);
    this.setAttrByPath('body/strokeWidth', strokeWidth);
    this.setAttrByPath('body/strokeDasharray', dash);
};

export default {
    name,
    ProcessShape
};
