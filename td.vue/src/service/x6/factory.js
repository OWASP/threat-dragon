import { Addon, Graph } from '@antv/x6';

const stencil = (config) => {
    return new Addon.Stencil(config);
};

const graph = (config) => {
    return new Graph(config);
};

export default {
    graph,
    stencil
};
