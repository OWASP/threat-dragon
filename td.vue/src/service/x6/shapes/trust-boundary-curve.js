import { Shape } from '@antv/x6';
import defaultProperties from '../../entity/default-properties';

const name = 'trust-boundary-curve';

export const TrustBoundaryCurve = Shape.Edge.define({
    constructorName: name,
    width: 200,
    height: 100,
    zIndex: 10,
    attrs: {
        line: {
            strokeWidth: 3,
            strokeDasharray: '5 5',
            sourceMarker: null,
            targetMarker: null
        }
    },
    connector: 'smooth',
    labels: [{
        attrs: {
            text: {
                text: ''
            }
        }
    }],
    data: defaultProperties.boundary
});

TrustBoundaryCurve.prototype.type = 'tm.Boundary';

TrustBoundaryCurve.prototype.updateStyle = function () {};

// TrustBoundaryCurve.prototype.updateStyle = function (color, dash, strokeWidth) {
//     // this.setAttrByPath('line/stroke', color);
//     this.setAttrByPath('line/strokeWidth', 3);
//     this.setAttrByPath('line/strokeDasharray', '5 5');
// };

TrustBoundaryCurve.prototype.setName = function (name) {
    this.setLabels([ name ]);
};

export default {
    TrustBoundaryCurve,
    name
};
