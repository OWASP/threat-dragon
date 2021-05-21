import { Graph } from '@antv/x6';
import trustBoundary from './trust-boundary.js';

const register = () => {
    Graph.registerNode(trustBoundary, trustBoundary.TrustBoundary);
};

export default {
    register
};
