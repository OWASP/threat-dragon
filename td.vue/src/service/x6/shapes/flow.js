import { Shape } from '@antv/x6';
import defaultProperties from '../../entity/default-properties';

const name = 'flow';

export const Flow = Shape.Edge.define({
    constructorName: name,
    width: 200,
    height: 100,
    zIndex: 10,
    attrs: {
        line: {
            strokeWidth: 3,
            sourceMarker: null,
            targetMarker: null
        }
    },
    connector: 'smooth',
    data: defaultProperties.flow
});

Flow.prototype.type = 'tm.Flow';

Flow.prototype.updateStyle = function () {};

Flow.prototype.setName = function (name) {
    this.setLabels([name]);
};

export default {
    Flow,
    name
};
