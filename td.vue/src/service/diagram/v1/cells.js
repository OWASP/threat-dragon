import edges from './edges.js';
import data from './data.js';
import nodes from './nodes.js';
import shapes from '@/service/x6/shapes/index.js';
import models from '@/service/threats/models/index.js';

const getCellConverter = () => ({
    'tm.Actor': {
        isNode: true,
        mapper: nodes.map(shapes.ActorShape)
    },
    'tm.Boundary': {
        isNode: false,
        mapper: edges.map(shapes.TrustBoundaryCurve)
    },
    'tm.Flow': {
        isNode: false,
        mapper: edges.map(shapes.Flow)
    },
    'tm.Process': {
        isNode: true,
        mapper: nodes.map(shapes.ProcessShape)
    },
    'tm.Store': {
        isNode: true,
        mapper: nodes.map(shapes.StoreShape)
    }
});

/**
 * Relates edges to the nodes
 * V1's framework relates them by id, whereas
 * x6 relates via object reference
 * @param {Object[]} nodes
 * @param {Object[]} edges
 */
const relateEdges = (nodes, edges) => {
    edges.forEach((edge) => {
        if (edge.source.id) {
            edge.source = nodes.find((node) => node.id === edge.source.id);
        }
        if (edge.target.id) {
            edge.target = nodes.find((node) => node.id === edge.target.id);
        }
    });
};

const map = (diagram) => {
    const resp = { nodes: [], edges: [] };

    // If the diagram is blank, there is no diagramJson
    if (!diagram.diagramJson) {
        return resp;
    }

    diagram.diagramJson.cells.forEach((cell) => {
        if (diagram.diagramType && models.allModels.includes(diagram.diagramType)) {
            cell.modelType = diagram.diagramType;
        }
        const { isNode, mapper } = getCellConverter()[cell.type];
        const entity = mapper(cell);
        const arr = isNode ? resp.nodes : resp.edges;
        arr.push(data.map(entity, cell));
    });

    relateEdges(resp.nodes, resp.edges);
    return resp;
};

export default {
    map
};
