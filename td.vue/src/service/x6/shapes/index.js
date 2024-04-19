import { Graph } from '@antv/x6';

import { ActorShape } from './actor.js';
import { Flow } from './flow.js';
import { FlowStencil } from './flow-stencil.js';
import { ProcessShape } from './process.js';
import { StoreShape } from './store.js';
import { TextBlock } from './text.js';
import { TrustBoundaryBox } from './trust-boundary-box.js';
import { TrustBoundaryCurve } from './trust-boundary-curve.js';
import { TrustBoundaryCurveStencil } from './trust-boundary-curve-stencil.js';

// this looks and is wrong, but a lot of existing models have this typo, so make compatible
Graph.registerNode('trust-broundary-curve', TrustBoundaryCurve);

Graph.registerNode('actor', ActorShape);
Graph.registerEdge('flow', Flow);
Graph.registerNode('process', ProcessShape);
Graph.registerNode('store', StoreShape);
Graph.registerNode('td-text-block', TextBlock);
Graph.registerNode('trust-boundary-box', TrustBoundaryBox);
Graph.registerEdge('trust-boundary-curve', TrustBoundaryCurve);

export default {
    ActorShape,
    Flow,
    FlowStencil,
    ProcessShape,
    StoreShape,
    TextBlock,
    TrustBoundaryBox,
    TrustBoundaryCurve,
    TrustBoundaryCurveStencil
};
