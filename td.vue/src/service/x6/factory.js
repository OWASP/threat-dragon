import { Addon, Graph } from '@antv/x6';

// the entity side bar is an X6 stencil add-on
const stencil = (config) => {
    return new Addon.Stencil(config);
};

// the threat diagram is an X6 graph
const graph = (config) => {
    return new Graph(config);
};

export default {
    graph,
    stencil
};
