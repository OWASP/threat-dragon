import { Shape } from '@antv/x6';

import { tc } from '@/i18n/index.js';

const name = 'trust-boundary-box';

// trust boundary box (dotted line, gray opaque background)
export const TrustBoundaryBox = Shape.Rect.define({
    constructorName: name,
    width: 500,
    height: 400,
    zIndex: -50,
    attrs: {
        body: {
            rx: 10,
            ry: 10,
            strokeWidth: 3,
            strokeDasharray: '10 5',
            fill: 'transparent',
            fillOpacity: 0
        },
        headerText: {
            text: tc('threatmodel.shapes.trustBoundary'),
            fill: '#333',
            strokeWidth: 0
        },
        header: {
            rx: 10,
            ry: 10,
            strokeWidth: 0,
            fillOpacity: 0
        }
    }
});

TrustBoundaryBox.prototype.setLabel = function (label) {
    this.setAttrByPath('headerText/text', label);
};

TrustBoundaryBox.prototype.getLabel = function () {
    return this.getAttrByPath('headerText/text');
};

TrustBoundaryBox.prototype.type = 'tm.BoundaryBox';

TrustBoundaryBox.prototype.setName = function (name) {
    this.setAttrByPath('headerText/text', name);
};

TrustBoundaryBox.prototype.updateStyle = function () {};

export default {
    name,
    TrustBoundaryBox
};
