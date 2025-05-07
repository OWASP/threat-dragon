import { Shape } from '@antv/x6';
import { tc } from '@/i18n/index.js';

const name = 'trust-boundary-box';

// trust boundary box (dotted line, transparent background)
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
        label: {
            text: tc('threatmodel.shapes.trustBoundary'),
            textAnchor: 'middle',
            textVerticalAnchor: 'middle',
            refX: 0.5, // Center horizontally
            refY: 20, // Position from top
            textWrap: {
                width: -45, // 90% of width (negative means percentage of width)
                height: 40, // Maximum height
                ellipsis: true // Show ellipsis when text overflows
            },
            fontSize: 14 // Increased font size to match other shapes
        }
    }
});

TrustBoundaryBox.prototype.type = 'tm.BoundaryBox';

TrustBoundaryBox.prototype.setName = function (name) {
    this.setAttrByPath('label/text', name);
};

TrustBoundaryBox.prototype.updateStyle = function () { };

export default {
    name,
    TrustBoundaryBox
};
