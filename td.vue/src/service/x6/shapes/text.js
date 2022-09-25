import { Shape } from '@antv/x6';

import { tc } from '@/i18n/index.js';

const name = 'text';

export const TextBlock = Shape.Rect.define({
    height: 80,
    width: 150,
    constructorName: name,
    zIndex: 0,
    label: tc('threatmodel.shapes.text'),
    attrs: {
        body: {
            magnet: false, // disabled because data flows not allowed to text box
            fillOpacity: 0,
            strokeOpacity: 0
        }
    }
});

TextBlock.prototype.updateStyle = function () {};

TextBlock.prototype.type = 'tm.Text';

TextBlock.prototype.setName = function (name) {
    this.label = name;
};

export default {
    name,
    TextBlock
};
