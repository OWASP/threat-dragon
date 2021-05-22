import { Graph } from '@antv/x6';

import trustBoundary from './trust-boundary.js';
import legacyTrustBoundary from './legacy-trust-boundary.js';
import processShape from './process.js';
import store from './store.js';

const register = () => {
    Graph.registerNode(trustBoundary, trustBoundary.TrustBoundary);
    Graph.registerNode(processShape.name, processShape.ProcessShape);
    Graph.registerNode(store.name, store.Store);
    Graph.registerNode(legacyTrustBoundary.name, legacyTrustBoundary.LegacyTrustBoundary);
};

export default {
    register
};
