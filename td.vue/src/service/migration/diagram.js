/**
 * @name diagram
 * @description Reads an existing v1 diagram to create components for the v2 UI
 * This is not for persistence, and is done on a diagram by diagram basis
 */
import { Actor } from '../x6/shapes/actor.js';
import { ProcessShape } from '../x6/shapes/process.js';
import { Store } from '../x6/shapes/store.js';

const getEdgeLabels = (cell) => {
    const labels = [];
    if (!cell.labels) {
        return labels;
    }

    cell.labels.forEach((label) => {
        labels.push({
            position: label.position,
            attrs: { label: { text: label.attrs.text.text }}
        });
    });

    return labels;
};

const entityMap = (constructor) => (cell) => {
    return new constructor({
        angle: cell.angle,
        width: cell.size.width,
        height: cell.size.height,
        x: cell.position.x,
        y: cell.position.y,
        id: cell.id,
        zIndex: cell.z,
        label: cell.attrs && cell.attrs.text && cell.attrs.text.text ? cell.attrs.text.text : ''
    });
};

const edgeMap = (cell) => {
    const edge = {
        source: cell.source,
        target: cell.target,
        vertices: cell.vertices,
        connector: 'smooth',
        attrs: {},
        labels: getEdgeLabels(cell)
    };

    return edge;
};

const cellConverter = {
    'tm.Actor': {
        isNode: true,
        mapper: entityMap(Actor)
    },
    'tm.Boundary': {
        isNode: false,
        mapper: edgeMap
    },
    'tm.Flow': {
        isNode: false,
        mapper: edgeMap
    },
    'tm.Process': {
        isNode: true,
        mapper: entityMap(ProcessShape)
    },
    'tm.Store': {
        isNode: true,
        mapper: entityMap(Store)
    }
};

/**
 * Relates edges to the nodes
 * V1's framework relates them by id, whereas
 * x6 relates via object reference
 * @param {Object[]} nodes
 * @param {Object[]} edges
 */
const relateEdges = (nodes, edges) => {
    edges.forEach((edge) =>{
        if (edge.source.id) {
            edge.source = nodes.find((node) => node.id === edge.source.id);
        }
        if (edge.target.id) {
            edge.target = nodes.find((node) => node.id === edge.target.id);
        }
    });
};

const addMetaData = (entity, cell) => {
    entity.data = {
        hasOpenThreats: cell.hasOpenThreats,
        outOfScope: cell.outOfScope,
        threats: cell.threats
    };

    const styleAttrs = {
        stroke: entity.data.hasOpenThreats ? 'red' : 'black',
        strokeDasharray: entity.data.outOfScope ? '2 2' : ''
    };

    // Legacy trust boundaries
    if (cell.type === 'tm.Boundary') {
        styleAttrs.stroke = 'green';
        styleAttrs.strokeWidth =  3;
        styleAttrs.strokeDasharray = '5 5';
        styleAttrs.targetMarker = null;
    }

    entity.attrs = Object.assign({}, entity.attrs, {
        body: styleAttrs,
        top: styleAttrs,
        line: styleAttrs
    });

    return entity;
};

const mapDiagram = (diagram) => {
    const resp = { nodes: [], edges: [] };
    
    // If the diagram is blank, there is no diagramJson
    if (!diagram.diagramJson) {
        return resp;
    }

    diagram.diagramJson.cells.forEach((cell) => {
        const { isNode, mapper } = cellConverter[cell.type];
        const entity = mapper(cell);
        const arr = isNode ? resp.nodes : resp.edges;
        arr.push(addMetaData(entity, cell));
    });

    relateEdges(resp.nodes, resp.edges);
    return resp;
};

export default {
    mapDiagram
};
