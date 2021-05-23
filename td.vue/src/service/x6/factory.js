import { Addon, Graph } from '@antv/x6';

const stencil = (config) => {
    return new Addon.Stencil(config);
};

const registerNode = (name, config) => {
    Graph.registerNode(name, config);
};

export default {
    registerNode,
    stencil
};
