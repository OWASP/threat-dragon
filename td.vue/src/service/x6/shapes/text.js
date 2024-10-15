import { Shape } from '@antv/x6';

import { tc } from '@/i18n/index.js';

const name = 'text';

// text block (rectangle, transparent)
export const TextBlock = Shape.Rect.define({
    constructorName: name,
    width: 150,
    height: 80,
    zIndex: 0,
    label: tc('threatmodel.shapes.text'),
    attrs: {
        body: {
            fill: 'transparent',
            fillOpacity: 0,
            strokeOpacity: 0
        }
    }
});

TextBlock.prototype.type = 'tm.Text';

TextBlock.prototype.setName = function (name) {
    this.label = name;
};

TextBlock.prototype.updateStyle = function () {};

export default {
    name,
    TextBlock
};
