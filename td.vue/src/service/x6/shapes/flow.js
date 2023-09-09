import { Shape } from '@antv/x6';

import defaultProperties from '../../entity/default-properties';

const name = 'flow';

// data flow (edge)
export const Flow = Shape.Edge.define({
    constructorName: name,
    width: 200,
    height: 100,
    zIndex: 10,
    attrs: {
        line: {
            strokeWidth: 1.5,
            sourceMarker: null,
            targetMarker: null
        }
    },
    connector: 'smooth',
    data: defaultProperties.flow
});

Flow.prototype.type = 'tm.Flow';

Flow.prototype.setName = function (name) {
    this.setLabels([name]);
};

Flow.prototype.updateStyle = function () {};

export default {
    Flow,
    name
};
