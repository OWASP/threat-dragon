import { Graph } from '@antv/x6';

import { Actor } from './actor.js';
import { Flow } from './flow.js';
import { FlowStencil } from './flow-stencil.js';
import { ProcessShape } from './process.js';
import { Store } from './store.js';
import { TextBlock } from './text.js';
import { TrustBoundaryBox } from './trust-boundary-box.js';
import { TrustBoundaryCurve } from './trust-boundary-curve.js';
import { TrustBoundaryCurveStencil } from './trust-boundary-curve-stencil.js';

Graph.registerNode('actor', Actor);
Graph.registerNode('flow', Flow);
Graph.registerNode('process', ProcessShape);
Graph.registerNode('store', Store);
Graph.registerNode('td-text-block', TextBlock);
Graph.registerNode('trust-boundary-box', TrustBoundaryBox);
Graph.registerNode('trust-broundary-curve', TrustBoundaryCurve);

export default {
    Actor,
    Flow,
    FlowStencil,
    ProcessShape,
    Store,
    TextBlock,
    TrustBoundaryBox,
    TrustBoundaryCurve,
    TrustBoundaryCurveStencil
};
